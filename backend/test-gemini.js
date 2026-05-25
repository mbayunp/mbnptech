// backend/test-gemini.js
require('dotenv').config();

async function cekModel() {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    console.log("🔍 Memeriksa daftar model yang diizinkan untuk API Key A Bayu...");

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.models) {
            console.log("\n✅ Model yang BERHAK Anda gunakan:");
            console.log("===================================");
            // Menyaring hanya model yang mendukung fungsi "generateContent"
            const supportedModels = data.models.filter(m =>
                m.supportedGenerationMethods.includes("generateContent")
            );

            supportedModels.forEach(m => console.log("- " + m.name.replace('models/', '')));
            console.log("===================================\n");
        } else {
            console.log("❌ Respon API Error:", data);
        }
    } catch (error) {
        console.error("Gagal mengecek:", error.message);
    }
}

cekModel();