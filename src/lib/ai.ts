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
        const prompt = `
            Analyse cette étiquette de vin.
            Extrais les informations suivantes au format JSON strict (sans Markdown autour):
            {
                "name": "Nom du vin (ex: Château Margaux)",
                "vintage": "Année (ex: 2015) ou null",
                "producer": "Producteur (ex: Domaine de la Romanée-Conti)",
                "type": "RED, WHITE, ROSE, SPARKLING, ou OTHER",
                "region": "Région (ex: Bordeaux, Bourgogne) ou null",
                "country": "Pays (ex: France, Italie) ou null",
                "grapes": "Cépages estimés ou indiqués (ex: Merlot, Cabernet) ou null"
            }
            Si tu ne trouves pas une info, mets null.
        `;

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
