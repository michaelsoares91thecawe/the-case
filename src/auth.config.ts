import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const userStatus = (auth?.user as any)?.status;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnAuth = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/signup');
            const isOnPending = nextUrl.pathname === '/pending';

            if (isOnDashboard) {
                if (isLoggedIn) {
                    if (userStatus !== 'APPROVED') {
                        return Response.redirect(new URL('/pending', nextUrl));
                    }
                    return true;
                }
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                if (userStatus !== 'APPROVED' && !isOnPending) {
                    return Response.redirect(new URL('/pending', nextUrl));
                }
                // If logged in and approved, redirect away from auth pages to dashboard
                if (isOnAuth || isOnPending) {
                    if (userStatus === 'APPROVED') {
                        return Response.redirect(new URL('/dashboard', nextUrl));
                    }
                }
            }
            return true;
        },
        jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.id = user.id
                token.status = (user as any).status
            }
            return token
        },
        session({ session, token }) {
            if (session.user) {
                session.user.id = (token.sub || token.id) as string;
                session.user.role = token.role as string;
                (session.user as any).status = token.status as string;
            }
            return session;
        }
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
