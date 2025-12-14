'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY || '');

export async function generateCellarAdvice(cellarItems: any[], userQuestion?: string) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // Summarize the cellar for the AI
        const summary = cellarItems.map(item => ({
            name: item.wine.name,
            type: item.wine.type,
            quantity: item.quantity,
            country: item.wine.country,
            region: item.wine.region,
            vintage: item.wine.vintage
        }));

        let prompt = "";

        if (userQuestion) {
            prompt = `
                Tu es un Sommelier Expert personnel. Voici l'inventaire actuel de la cave à vin de l'utilisateur (format JSON) :
                ${JSON.stringify(summary)}

                L'utilisateur te pose cette question : "${userQuestion}"

                Réponds de manière précise, utile et conviviale en te basant sur le contenu de sa cave si pertinent.
                Si la question ne concerne pas directement la cave (ex: "Quel fromage avec un Saint-Émilion ?"), réponds avec ton expertise générale de sommelier mais essaie de lier la réponse à une bouteille de son inventaire s'il en a une compatible.
                
                Format : Markdown.
            `;
        } else {
            prompt = `
                Tu es un Sommelier Expert personnel. Analyse la cave à vin suivante donnée au format JSON :
                ${JSON.stringify(summary)}

                Ta mission est de me donner un bilan court et percutant de ma cave (en français).
                1. Analyse l'équilibre (Rouge vs Blanc vs Autres).
                2. Identifie les points forts (Régions, Millésimes).
                3. Donne 3 recommandations concrètes d'achat pour diversifier ou compléter ma cave, en expliquant pourquoi.
                4. Sois élégant, encourageant et professionnel.
                
                Format de réponse souhaité : Markdown (Utilise des titres, des listes à puces).
            `;
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("AI Error:", error);
        return `Erreur lors de l'analyse : ${error instanceof Error ? error.message : String(error)}`;
    }
}

export async function analyzeWineLabel(imageBase64: string) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            Tu es un Sommelier Expert mondialement reconnu.Analyse cette image d'étiquette de vin.
            Ta mission est d'extraire les informations visibles MAIS AUSSI de DÉDUIRE les informations manquantes grâce à ta connaissance encyclopédique.

            Règles de déduction:
        1. Si l'année n'est pas visible, cherche une petite mention ou déduis - la si possible(sinon null).
            2. Si le pays n'est pas écrit, DÉDUIS-LE de la région (ex: Bordeaux -> France, Chianti -> Italie (Italy), Rioja -> Espagne (Spain)). Le pays DOIT être en Anglais (ex: France, Italy, Spain, USA).
        3. Si les cépages(grapes) ne sont pas écrits, DÉDUIS - LES de l'appellation ou de la région (ex: Chablis -> Chardonnay, Beaujolais -> Gamay, Barolo -> Nebbiolo).
        4. Le TYPE(RED, WHITE...) doit être cohérent avec l'appellation (ex: Chablis = WHITE).

            Extrais les résultats au format JSON strict:
        {
            "name": "Nom complet du vin (Producteur + Cuvée)",
                "vintage": "Année (entier, ex: 2015) ou null",
                    "producer": "Nom du domaine/producteur",
                        "type": "RED, WHITE, ROSE, SPARKLING, ou OTHER",
                            "region": "Région/Appellation",
                                "country": "Pays (en Anglais, ex: France)",
                                    "grapes": "Cépages principaux (ex: Merlot, Cabernet Sauvignon)"
        }
            Si tu es sûr à 90 % d'une info non écrite, mets-la. Si tu ne trouves vraiment pas, mets null.

        const imagePart = {
            inlineData: {
                data: imageBase64,
                mimeType: "image/jpeg",
            },
        };

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown code blocks if present
        const jsonString = text.replace(/```json\n|\n```/g, "").replace(/```/g, "").trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("AI Label Analysis Error:", error);
        return null;
    }
}

export async function estimateWinePrice(wineName: string, producer: string, vintage: number | null, country: string | null) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `
            Tu es un expert mondial en valorisation de vins et sommelier.
            Estime le prix moyen actuel du marché (Prix de vente moyen TTC en magasin spécialisé ou en ligne en Europe, en Euros) pour le vin suivant :
            
            Vin: ${wineName}
            Producteur: ${producer}
            Millésime: ${vintage || "Non spécifié"}
            Pays: ${country || "Non spécifié"}

            Si le millésime est manquant, donne une estimation pour un millésime récent représentatif.
            Cherche dans ta base de connaissances les prix actuels (Vivino, Wine-Searcher, marchands).

            Réponds STRICTEMENT au format JSON :
            {
                "price": number (Prix en Euros, ex: 25.50),
                "confidence": "string" (low, medium, high),
                "currency": "EUR"
            }
            Si tu ne trouves pas le vin exact, donne une estimation basée sur l'appellation et le producteur, avec confidence 'low'.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const jsonString = text.replace(/```json\n|\n```/g, "").replace(/```/g, "").trim();
        return JSON.parse(jsonString) as { price: number, confidence: string, currency: string };

    } catch (error) {
        console.error("AI Price Estimation Error:", error);
        return null;
    }
}
