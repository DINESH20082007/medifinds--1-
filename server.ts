import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY || "";
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const HOST = process.env.HOST || "127.0.0.1";
  const PORT = Number(process.env.PORT || 3000);

  app.use(express.json({ limit: "10mb" }));

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "Medifind API Server", time: new Date().toISOString() });
  });

  // AI Assistant Chatbot API Endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history, userContext } = req.body;
      const ai = getGeminiClient();

      const systemInstruction = `You are "Medifind AI Health Assistant", an intelligent, highly helpful 24/7 medical & pharmacy assistant for the Medifind platform.
      Rules:
      1. Provide clear, empathetic, and accurate health information regarding medicines, usages, generic alternatives, side effects, and precautions.
      2. Always include a short friendly disclaimer when discussing prescription drugs: "Please consult a registered physician or pharmacist before starting new medication."
      3. If the user asks about medicine stock or nearby pharmacies, explain that Medifind provides real-time GPS stock tracking across 10,000+ partner pharmacies.
      4. Highlight age restrictions (e.g., Schedule H/H1 drugs require prescription and age 18+ verification) when applicable.
      5. Context provided about the current customer profile: ${JSON.stringify(userContext || {})}.
      Keep answers structured, concise, and formatted with clean bullet points when explaining dosage or precautions.`;

      const contents = [
        ...(history || []).map((h: { sender: string; text: string }) => ({
          role: h.sender === "user" ? "user" : "model",
          parts: [{ text: h.text }],
        })),
        {
          role: "user",
          parts: [{ text: message }],
        },
      ];

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text || "I'm sorry, I couldn't process that request right now." });
    } catch (error: any) {
      console.error("Error in AI Chatbot API:", error);
      res.status(500).json({
        error: "Failed to generate AI response",
        details: error?.message || "Unknown error",
        text: "I am having trouble connecting to Medifind AI servers. Please try again shortly or search directly on Medifind.",
      });
    }
  });

  // AI Demand Prediction for Pharmacy Dashboard API
  app.post("/api/demand-prediction", async (req, res) => {
    try {
      const { pharmacyName, inventory, salesHistory } = req.body;
      const ai = getGeminiClient();

      const prompt = `Analyze the current pharmacy inventory and recent sales data for pharmacy "${pharmacyName || 'Medifind Pharmacy'}":
      Inventory summary: ${JSON.stringify(inventory || [])}
      Sales trends: ${JSON.stringify(salesHistory || [])}
      
      Generate a realistic 30-day demand prediction and restocking strategy. Provide:
      1. Top 3 high-demand medicines predicted to run out soon.
      2. 2 seasonal health trends (e.g., monsoon fever/monsoon flu season, allergies).
      3. Specific restocking recommendations (quantities to order).
      4. Fast-moving vs slow-moving categories.
      
      Return JSON format strictly.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.4,
        },
      });

      const responseText = response.text || "{}";
      const parsedData = JSON.parse(responseText);
      res.json({ success: true, prediction: parsedData });
    } catch (error: any) {
      console.error("Error in Demand Prediction API:", error);
      res.status(500).json({
        error: "Failed to generate AI demand forecast",
        fallbackPrediction: {
          topDemand: [
            { medicine: "Paracetamol 650mg", status: "High Demand", suggestedReorder: 200, reason: "Seasonal viral fever surge" },
            { medicine: "Cetirizine 10mg", status: "Moderate Demand", suggestedReorder: 100, reason: "Monsoon allergy spike" },
            { medicine: "Azithromycin 500mg", status: "Critical Low", suggestedReorder: 50, reason: "Prescription antibiotic trend" }
          ],
          seasonalTrends: ["Monsoon Flu & Viral Fever Season", "Allergic Rhinitis Surge"],
          fastMovingCategory: "Antipyretics & Analgesics",
          slowMovingCategory: "Ophthalmic Drops"
        }
      });
    }
  });

  // AI Prescription Image Analyzer Endpoint
  app.post("/api/prescriptions/analyze", async (req, res) => {
    try {
      const { imageBase64 } = req.body;
      if (!imageBase64) {
        return res.status(400).json({ error: "Missing image data" });
      }

      const ai = getGeminiClient();
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Data,
              },
            },
            {
              text: "Extract all medicines, dosages, frequencies, and doctor instructions from this prescription image. Return a JSON array with objects containing { medicineName, dosage, frequency, duration, notes, requiresPrescription }.",
            },
          ],
        },
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "[]");
      res.json({ success: true, extractedMedicines: parsed });
    } catch (error: any) {
      console.error("Error analyzing prescription:", error);
      res.status(500).json({
        error: "Prescription processing failed",
        extractedMedicines: [
          { medicineName: "Paracetamol 650mg", dosage: "1 Tablet", frequency: "Twice daily after meals", duration: "5 Days", notes: "For fever and body pain", requiresPrescription: false },
          { medicineName: "Amoxicillin 500mg", dosage: "1 Capsule", frequency: "Thrice daily", duration: "7 Days", notes: "Complete full course", requiresPrescription: true }
        ]
      });
    }
  });

  // Serve static or Vite dev middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`[Medifind] Server running on http://${HOST}:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start Medifind server:", err);
});
