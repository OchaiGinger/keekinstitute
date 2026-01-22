const fs = require('fs');
const path = require('path');
const { ConvexHttpClient } = require('convex/browser');

// Read .env.local file
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const convexUrl = envContent.match(/NEXT_PUBLIC_CONVEX_URL=(.+)/)?.[1]?.trim();

if (!convexUrl) {
    console.error('❌ NEXT_PUBLIC_CONVEX_URL not found in .env.local');
    process.exit(1);
}

async function seedCategories() {
    console.log('🌱 Seeding categories to Convex...\n');
    console.log('Convex URL:', convexUrl);

    const client = new ConvexHttpClient(convexUrl);

    const categoryNames = [
        "Computer Science",
        "Music",
        "Fitness",
        "Photography",
        "Accounting",
        "Engineering",
        "Filming",
    ];

    let successCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const categoryName of categoryNames) {
        try {
            // Check if category already exists
            const existingCategories = await client.query('categories:getAll');
            const exists = existingCategories?.some(cat => cat.name === categoryName);

            if (exists) {
                console.log(`⊘ Already exists: ${categoryName}`);
                skippedCount++;
                continue;
            }

            // Call using the function reference approach
            const result = await client.mutation('categories:create', { name: categoryName });
            console.log(`✓ Created: ${categoryName}`);
            successCount++;
        } catch (error) {
            console.log(`✗ Error creating ${categoryName}:`, error.message);
            errorCount++;
        }
    }

    console.log(`\n✅ Seeding completed! (${successCount} created, ${skippedCount} skipped, ${errorCount} errors)`);
    process.exit(errorCount > 0 ? 1 : 0);
}

seedCategories();

