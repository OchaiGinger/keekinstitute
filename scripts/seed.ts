const { ConvexClient } = require("convex/browser");
require("dotenv").config({ path: ".env.local" });

const client = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL);

async function main() {
    try {
        console.log("🌱 Seeding categories to Convex...\n");
        console.log("CONVEX_URL:", process.env.NEXT_PUBLIC_CONVEX_URL);

        const categoryNames = [
            "Computer Science",
            "Music",
            "Fitness",
            "Photography",
            "Accounting",
            "Engineering",
            "Filming",
        ];

        for (const categoryName of categoryNames) {
            try {
                // Call Convex mutation directly using HTTP
                const response = await fetch(`${process.env.NEXT_PUBLIC_CONVEX_URL}/api/categories.create`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: categoryName }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                console.log(`✓ Created: ${categoryName}`);
            } catch (error) {
                console.log(`✗ Error creating ${categoryName}:`, error);
            }
        }

        console.log("\n✅ Seeding completed!");
    } catch (error) {
        console.error("❌ Error during seeding:", error);
        process.exit(1);
    }
}

main();