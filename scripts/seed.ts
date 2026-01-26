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

                console.log(`✓ Created category: ${categoryName}`);
            } catch (error) {
                console.log(`✗ Error creating category ${categoryName}:`, error);
            }
        }

        // Seed student categories
        console.log("\n🌱 Seeding student categories to Convex...\n");

        const studentCategories = [
            { name: "IT Students", description: "Students from the IT/Computer Science department" },
            { name: "External Students", description: "External students joining from polytechnic institutions" },
            { name: "KeekInstitute Students", description: "Main Kee Institute students" },
        ];

        for (const studentCat of studentCategories) {
            try {
                // Call Convex mutation directly using HTTP
                const response = await fetch(`${process.env.NEXT_PUBLIC_CONVEX_URL}/api/studentCategories.create`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: studentCat.name, description: studentCat.description }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                console.log(`✓ Created student category: ${studentCat.name}`);
            } catch (error) {
                console.log(`✗ Error creating student category ${studentCat.name}:`, error);
            }
        }

        console.log("\n✅ Seeding completed!");
    } catch (error) {
        console.error("❌ Error during seeding:", error);
        process.exit(1);
    }
}

main();