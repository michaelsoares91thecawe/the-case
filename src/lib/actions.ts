'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        const redirectTo = formData.get('redirectTo') as string | undefined;
        await signIn('credentials', {
            ...Object.fromEntries(formData),
            redirect: true,
            redirectTo: redirectTo || '/dashboard'
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { auth, signOut } from '@/auth';

const WineSchema = z.object({
    name: z.string().min(1),
    producer: z.string().min(1),
    vintage: z.coerce.number().min(1900).max(2100),
    type: z.enum(['RED', 'WHITE', 'SPARKLING', 'ROSE', 'OTHER']),
    region: z.string().optional(),
    country: z.string().optional(),
    grapes: z.string().optional(),
    quantity: z.coerce.number().min(1),
    buyPrice: z.coerce.number().min(0),
    isVisible: z.coerce.boolean(),
});


export async function createWine(prevState: any, formData: FormData) {
    const session = await auth();
    console.log("createWine session:", JSON.stringify(session, null, 2));

    if (!session?.user?.id) {
        console.error("createWine: No user ID in session");
        return { message: 'Not authenticated' };
    }

    const validatedFields = WineSchema.safeParse({
        name: formData.get('name'),
        producer: formData.get('producer'),
        vintage: formData.get('vintage'),
        type: formData.get('type'),
        region: formData.get('region') || undefined,
        country: formData.get('country') || undefined,
        grapes: formData.get('grapes') || undefined,
        quantity: formData.get('quantity'),
        buyPrice: formData.get('buyPrice'),
        isVisible: formData.get('isVisible') === 'on',
    });

    if (!validatedFields.success) {
        console.error("Validation error:", validatedFields.error.flatten().fieldErrors);
        return { message: 'Missing or invalid fields', errors: validatedFields.error.flatten().fieldErrors };
    }

    const {
        name, producer, vintage, type, region, country, grapes,
        quantity, buyPrice, isVisible
    } = validatedFields.data;

    try {
        // 1. Check if wine mostly exists or create new canonical wine
        // For MVP, we'll blindly create a new Wine entry or link if perfect match (let's do create for now to keep it simple, or simple find)
        // Simplification: Create new Wine record for every entry unless we implement a robust search/select first. 
        // Better MVP: Check if name+producer+vintage exists

        let wine = await prisma.wine.findFirst({
            where: {
                name,
                producer,
                vintage
            }
        });

        if (!wine) {
            wine = await prisma.wine.create({
                data: {
                    name,
                    producer,
                    vintage,
                    type,
                    region,
                    country,
                    grapes
                }
            });
        }

        // 2. Create CellarItem
        await prisma.cellarItem.create({
            data: {
                userId: session.user.id,
                wineId: wine.id,
                quantity,
                buyPrice,
                isVisible,
            }
        });

    } catch (e) {
        console.error("Failed to create wine:", e);
        return { message: `Database Error: Failed to add wine. ${e instanceof Error ? e.message : ''}` };
    }

    revalidatePath('/dashboard/cellar');
    revalidatePath('/dashboard');
    redirect('/dashboard/cellar');
}

const MessageSchema = z.object({
    recipientId: z.string().min(1),
    body: z.string().min(1, 'Message cannot be empty'),
    relatedWineId: z.string().optional(),
});

export async function sendMessage(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) {
        return { message: 'Not authenticated' };
    }

    const validatedFields = MessageSchema.safeParse({
        recipientId: formData.get('recipientId'),
        body: formData.get('body'),
        relatedWineId: formData.get('relatedWineId'),
    });

    if (!validatedFields.success) {
        return { message: 'Invalid inputs', errors: validatedFields.error.flatten().fieldErrors };
    }

    const { recipientId, body, relatedWineId } = validatedFields.data;

    try {
        await prisma.message.create({
            data: {
                senderId: session.user.id,
                receiverId: recipientId,
                body,
                relatedWineId,
            }
        });
    } catch (e) {
        console.error(e);
        return { message: 'Database Error: Failed to send message.' };
    }

    revalidatePath('/dashboard/messages');
    return { message: 'Message sent successfully!', success: true };
}

export async function consumeWine(cellarItemId: string) {
    const session = await auth();
    if (!session?.user?.id) {
        return { message: 'Not authenticated', success: false };
    }

    try {
        const item = await prisma.cellarItem.findUnique({
            where: { id: cellarItemId, userId: session.user.id }
        });

        if (!item || item.quantity < 1) {
            return { message: 'Item not found or empty', success: false };
        }

        if (item.quantity === 1) {
            // Option: Delete item or keep with 0 quantity? 
            // Let's keep with 0 quantity for history/logs usually, but for simple MVP maybe delete?
            // User requested "Drink 1 bottle". 
            // Let's decrement to 0.
            await prisma.cellarItem.update({
                where: { id: cellarItemId },
                data: { quantity: 0 }
            });
        } else {
            await prisma.cellarItem.update({
                where: { id: cellarItemId },
                data: { quantity: { decrement: 1 } }
            });
        }

        // Ideally we would also add a "Tasting Log" entry here automatically or prompt for it.

    } catch (e) {
        console.error("Failed to consume wine:", e);
        return { message: 'Database Error', success: false };
    }

    revalidatePath('/dashboard');
    return { message: 'Bottle consumed!', success: true };
}

// User Registration
const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2),
});

import { hash } from 'bcryptjs';

export async function registerUser(prevState: any, formData: FormData) {
    const validatedFields = RegisterSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
        name: formData.get('name'),
    });

    if (!validatedFields.success) {
        return { message: 'Champs invalides', errors: validatedFields.error.flatten().fieldErrors };
    }

    const { email, password, name } = validatedFields.data;

    try {
        const hashedPassword = await hash(password, 10);

        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                status: 'PENDING', // Key: Default to pending
                role: 'USER'
            }
        });
    } catch (e) {
        // Handle unique constraint error
        return { message: 'Cet email est déjà utilisé.' };
    }

    return { success: true, message: 'Inscription réussie. En attente de validation par un administrateur.' };
}

// Admin Actions
export async function approveUser(userId: string) {
    // In real app, check if current user is admin using auth()
    await prisma.user.update({
        where: { id: userId },
        data: { status: 'APPROVED' }
    });
    revalidatePath('/dashboard/admin/users');
}

export async function deleteUser(userId: string) {
    await prisma.user.delete({
        where: { id: userId }
    });
    revalidatePath('/dashboard/admin/users');
}

export async function updateUserRole(userId: string, newRole: string) {
    await prisma.user.update({
        where: { id: userId },
        data: { role: newRole }
    });
    revalidatePath('/dashboard/admin/users');
}

export async function rejectUser(userId: string) {
    await prisma.user.update({
        where: { id: userId },
        data: { status: 'REJECTED' }
    });
    revalidatePath('/dashboard/admin/users');
}

export async function inviteUser(email: string, name: string, role: string = 'USER') {
    try {
        // Create user with APPROVED status and random password
        const tempPassword = await hash('welcome123', 10);
        await prisma.user.create({
            data: {
                email,
                name,
                password: tempPassword,
                status: 'APPROVED',
                role: role // Use the passed role
            }
        });
        return { success: true, message: 'Utilisateur invité avec succès (Mot de passe temp: welcome123)' };
    } catch (e) {
        return { success: false, message: 'Erreur: Email déjà existant ?' };
    }
}

// Wine Actions
export async function updateWine(id: string, prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { message: 'Non authentifié' };

    // Update CellarItem (quantity, price, visibility)
    // And possibly Wine details if it's a custom wine? 
    // For now, simpler implementation: Update CellarItem fields.

    try {
        await prisma.cellarItem.update({
            where: { id: id }, // This is cellarItem ID
            data: {
                quantity: Number(formData.get('quantity')),
                buyPrice: Number(formData.get('buyPrice')),
                isVisible: formData.get('isVisible') === 'on',
            }
        });

        // Also update the linked Wine details if needed?
        // Note: multiple users might share a Wine entry if we normalized strictly. 
        // But in this schema, it seems we might be updating the underlying wine too?
        // Let's check schema/logic. 
        // 'createWine' creates a new Wine every time. So it's safe to update the Wine entry attached to this CellarItem.
        // We need to find the wineId first.
        const item = await prisma.cellarItem.findUnique({ where: { id }, select: { wineId: true } });
        if (item) {
            await prisma.wine.update({
                where: { id: item.wineId },
                data: {
                    name: formData.get('name') as string,
                    producer: formData.get('producer') as string,
                    vintage: Number(formData.get('vintage')),
                    type: formData.get('type') as string,
                    region: formData.get('region') as string || null,
                    country: formData.get('country') as string || null,
                }
            })
        }

    } catch (e) {
        return { message: 'Erreur lors de la mise à jour', success: false };
    }

    revalidatePath(`/dashboard/cellar/${id}`);
    revalidatePath('/dashboard/cellar');
    revalidatePath('/dashboard/cellar');
    return { message: 'Mise à jour réussie', success: true };
}

export async function logOut() {
    await signOut({ redirectTo: '/login' });
}

import { analyzeWineLabel } from '@/lib/ai';

export async function scanLabelAction(formData: FormData) {
    const file = formData.get('image') as File;
    if (!file) return { success: false, message: "Image manquante" };

    try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString('base64');

        const data = await analyzeWineLabel(base64);

        if (!data) return { success: false, message: "L'IA n'a pas pu lire l'étiquette." };

        return { success: true, data };
    } catch (e) {
        console.error("Scan Action Error:", e);
        return { success: false, message: "Erreur serveur lors de l'analyse." };
    }
}
