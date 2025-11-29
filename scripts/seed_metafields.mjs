import { createAdminApiClient } from '@shopify/admin-api-client';
import 'dotenv/config';

const SHOP = 'hbjadm-n5.myshopify.com';
const ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;

if (!ACCESS_TOKEN) {
    console.error('Error: SHOPIFY_ADMIN_API_TOKEN is not defined in .env or environment variables.');
    console.log('Please add your Admin API Access Token to .env as SHOPIFY_ADMIN_API_TOKEN=shpat_...');
    process.exit(1);
}

const client = createAdminApiClient({
    storeDomain: SHOP,
    apiVersion: '2024-01',
    accessToken: ACCESS_TOKEN,
});

// --- Data Definitions ---

const METAFIELD_DEFINITIONS = [
    { name: 'Tagline', key: 'tagline', type: 'single_line_text_field', description: 'Short product tagline' },
    { name: 'Micro Trust', key: 'micro_trust', type: 'single_line_text_field', description: 'Trust badges' },
    { name: 'Key Benefits', key: 'key_benefits', type: 'json', description: 'List of benefits' },
    { name: 'Flavor Profile', key: 'flavor_profile', type: 'json', description: 'Texture, taste, finish' },
    { name: 'Usage Ideas', key: 'usage_ideas', type: 'json', description: 'Usage suggestions' },
    { name: 'Reviews', key: 'reviews', type: 'json', description: 'Customer quotes' },
    { name: 'Heat Levels', key: 'heat_levels', type: 'json', description: 'Available heat options' },
    { name: 'Bundle Contents', key: 'bundle_contents', type: 'json', description: 'Products in bundle' },
    { name: 'Why Bundle', key: 'why_bundle', type: 'json', description: 'Reasons to buy bundle' },
    { name: 'Usage Moments', key: 'usage_moments', type: 'json', description: 'Occasions for bundle' },
];

const PRODUCTS_DATA = [
    {
        handle_keywords: ['tuffaahy', 'olive'],
        data: {
            tagline: "Crushed, vibrant, and naturally flavorful.",
            micro_trust: "Small-batch crafted · Clean ingredients · Signature blend",
            key_benefits: [
                "Crushed Tuffaahy olives mixed with fresh vegetables",
                "Clean ingredients with no artificial additives",
                "Rich, aromatic brine crafted in small batches",
                "Firm crisp texture + colorful premium presentation",
                "A gourmet mezze essential for hosting"
            ],
            flavor_profile: {
                texture: "Firm olive bite + crisp vegetables",
                taste: "Bright, rich, aromatic, herb-infused",
                finish: "Clean, smooth, refreshing acidity"
            },
            usage_ideas: [
                "Hosting tables",
                "Cheese & charcuterie boards",
                "Mezze platters",
                "Daily snacking",
                "Sandwiches & wraps",
                "Pairing with grilled meats"
            ],
            reviews: [
                "The mix is incredible — the peppers and carrots make it addictive.",
                "A premium crushed olive blend. Easily my favorite."
            ],
            heat_levels: ["Mild", "Normal", "Spicy"]
        }
    },
    {
        handle_keywords: ['cucumber', 'low-salt'],
        data: {
            tagline: "Crisp. Light. Naturally refreshing.",
            micro_trust: "Low salt · Clean ingredients · Small-batch crafted",
            key_benefits: [
                "Naturally low in salt",
                "Light, refreshing, crisp",
                "Clean ingredients only",
                "Perfect for wellness-focused customers",
                "Small-batch crafted"
            ],
            flavor_profile: {
                texture: "Firm, crunchy",
                taste: "Light, bright, refreshing",
                salt_level: "Very low, health-friendly"
            },
            usage_ideas: [
                "Healthy lunches",
                "Post-gym snack",
                "Snack bowls",
                "Mezze tables",
                "Sandwiches & wraps"
            ],
            reviews: [
                "Finally a low-salt pickle that tastes amazing.",
                "My daily healthy go-to."
            ],
            heat_levels: ["Mild", "Normal"]
        }
    },
    {
        handle_keywords: ['cabbage', 'tangerine'],
        data: {
            tagline: "Probiotic. Crisp. Refreshing citrus.",
            micro_trust: "Probiotic · Naturally fermented · Clean ingredients",
            key_benefits: [
                "Naturally fermented (probiotic)",
                "Clean, natural ingredients",
                "Crisp, refreshing texture",
                "Light citrus aroma",
                "Great for wellness-focused consumers"
            ],
            flavor_profile: {
                texture: "Crunchy, crisp",
                taste: "Bright, lightly tangy with citrus notes",
                health: "Naturally probiotic"
            },
            usage_ideas: [
                "Healthy bowls",
                "Salads",
                "Sandwiches",
                "Side for chicken or fish",
                "Mezze tables"
            ],
            reviews: [
                "Light, refreshing, addictive.",
                "The Tangerine twist is brilliant."
            ],
            heat_levels: ["Mild", "Normal"]
        }
    },
    {
        handle_keywords: ['lemon', 'harissa'],
        data: {
            tagline: "Bold. Spicy or not. Full of character.",
            micro_trust: "Small-batch crafted · Clean ingredients · Rich flavor",
            key_benefits: [
                "Intense, bold harissa infusion",
                "Perfect for cooking & marinades",
                "Clean ingredients",
                "Small-batch consistency",
                "Ideal for gourmet hosting"
            ],
            flavor_profile: {
                texture: "Soft peel, rich sauce",
                taste: "Spicy, zesty, aromatic",
                heat_level: "Medium–hot"
            },
            usage_ideas: [
                "Roast chicken",
                "Fish marinades",
                "BBQ plates",
                "Mezze boards",
                "Pasta sauces"
            ],
            reviews: [
                "Perfect taste, the best lemon ever, after taste is an experience itself",
                "These lemons take dishes to another level.",
                "A must-have for cooking."
            ],
            heat_levels: ["Mild", "Spicy"]
        }
    },
    {
        handle_keywords: ['signature', 'box'],
        data: {
            tagline: "All Four Premium Flavors, One Elegant Box",
            micro_trust: "Fresh weekly · Small-batch crafted · Clean ingredients",
            bundle_contents: [
                { name: "Tuffaahy Olives — Signature Mix", weight: "1Kg", description: "Gently crushed Tuffaahy olives mixed with diced carrots, pepper slices, fresh celery, and aromatic brine." },
                { name: "Low-Salt Cucumbers with Celery", weight: "1Kg", description: "Crisp, refreshing, naturally light." },
                { name: "Tangerine-Infused Cabbage", weight: "1Kg", description: "Naturally fermented, probiotic, citrus twist." },
                { name: "Half Lemons with Harissa", weight: "1Kg", description: "Bold, spicy, perfect for cooking & hosting." }
            ],
            why_bundle: [
                "Ideal for first-time buyers",
                "Perfect for gifting & hosting",
                "Balanced flavor selection",
                "Premium presentation",
                "Most popular Teta Aida bundle"
            ],
            usage_moments: [
                "Dinner parties",
                "Cheese boards & mezze tables",
                "Family gatherings",
                "Gourmet gifting",
                "Cooking enhancements"
            ],
            reviews: [
                "Each jar tastes completely different — in the best way.",
                "A beautiful gift.",
                "The perfect introduction to the brand."
            ]
        }
    },
    {
        handle_keywords: ['healthy', 'living'],
        data: {
            tagline: "Clean, Light & Naturally Healthy",
            micro_trust: "Low salt · Naturally fermented · Clean ingredients",
            bundle_contents: [
                { name: "Low-Salt Cucumbers with Celery", weight: "1Kg", description: "Crisp, refreshing, crafted for healthy living." },
                { name: "Tangerine-Infused Cabbage", weight: "1Kg", description: "Naturally fermented, probiotic, citrus aroma." }
            ],
            why_bundle: [
                "Ideal for clean-eating lifestyles",
                "Light on the stomach",
                "Great daily fridge essential",
                "Wellness-conscious selection",
                "Premium quality, elegant packaging"
            ],
            usage_moments: [
                "Healthy lunches",
                "Gym meals",
                "Light dinners",
                "Post-workout snacks",
                "Clean ingredient meal prep"
            ],
            reviews: [
                "Finally a low-salt pickle that tastes amazing.",
                "My everyday healthy go-to."
            ]
        }
    },
    {
        handle_keywords: ['spicy', 'lover'],
        data: {
            tagline: "For Lovers of Bold, Fiery Flavor",
            micro_trust: "Bold flavors · Aromatic blends · Small-batch crafted",
            bundle_contents: [
                { name: "Tuffaahy Olives — Signature Mix", weight: "1Kg", description: "Crushed Tuffaahy olives with vegetables and aromatic brine — rich flavor base for every mezze." },
                { name: "Half Lemons with Harissa", weight: "1Kg", description: "Fiery, bold, unforgettable." }
            ],
            why_bundle: [
                "Perfect for spice lovers",
                "Adds bold flavor to any meal",
                "Great for cooking & marinades",
                "Premium mezze choice",
                "Rich, aromatic combinations"
            ],
            usage_moments: [
                "Seasoning for chicken & meats",
                "Mezze boards",
                "BBQ plates",
                "Sandwiches",
                "Hosting nights"
            ],
            reviews: [
                "The harissa lemons are insane — addictive.",
                "Amazing bold flavors."
            ]
        }
    },
    {
        handle_keywords: ['hosting', 'box'],
        data: {
            tagline: "Made for Elegant Tables & Special Gatherings",
            micro_trust: "Elegant presentation · Premium jars · Guest-approved",
            bundle_contents: [
                { name: "Tuffaahy Olives — Signature Mix", weight: "2Kg (2x 1Kg)", description: "Perfect for mezze tables & sharing." },
                { name: "Half Lemons with Harissa", weight: "1Kg", description: "Bold and unforgettable for hostess platters." },
                { name: "Choice: Tangerine Cabbage OR Low-Salt Cucumbers", weight: "1Kg", description: "Choose your preferred hosting style — refreshing or healthy." }
            ],
            why_bundle: [
                "Perfect for guests",
                "Enhances table presentation",
                "Balanced flavors for all palates",
                "Premium for brunch, dinner, or celebrations",
                "Ideal gourmet gift"
            ],
            usage_moments: [
                "Dinner parties",
                "Brunch gatherings",
                "Cheese & charcuterie boards",
                "Special occasions",
                "Family hosting"
            ],
            reviews: [
                "This box transformed our table.",
                "Guests kept asking where it's from."
            ]
        }
    }
];

// --- Helper Functions ---

async function createMetafieldDefinition(def) {
    const query = `
    mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
      metafieldDefinitionCreate(definition: $definition) {
        createdDefinition {
          id
          name
          namespace
          key
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

    const variables = {
        definition: {
            name: def.name,
            namespace: 'custom',
            key: def.key,
            description: def.description,
            type: def.type,
            ownerType: 'PRODUCT'
        }
    };

    try {
        const response = await client.request(query, { variables });
        if (response.data?.metafieldDefinitionCreate?.userErrors?.length > 0) {
            const error = response.data.metafieldDefinitionCreate.userErrors[0];
            if (error.message.includes('already exists')) {
                console.log(`✓ Metafield definition ${def.key} already exists.`);
            } else {
                console.error(`✗ Failed to create definition ${def.key}:`, error.message);
            }
        } else {
            console.log(`✓ Created metafield definition: ${def.key}`);
        }
    } catch (error) {
        console.error(`Error creating definition ${def.key}:`, error);
    }
}

async function fetchAllProducts() {
    const query = `
    query {
      products(first: 50) {
        edges {
          node {
            id
            title
            handle
          }
        }
      }
    }
  `;
    const response = await client.request(query);
    return response.data?.products?.edges?.map(e => e.node) || [];
}

async function updateProductMetafields(productId, data) {
    const metafields = Object.entries(data).map(([key, value]) => ({
        namespace: 'custom',
        key: key,
        value: typeof value === 'string' ? value : JSON.stringify(value),
        type: typeof value === 'string' ? 'single_line_text_field' : 'json'
    }));

    const query = `
    mutation UpdateProduct($input: ProductInput!) {
      productUpdate(input: $input) {
        product {
          id
          title
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

    const variables = {
        input: {
            id: productId,
            metafields: metafields
        }
    };

    try {
        const response = await client.request(query, { variables });
        if (response.data?.productUpdate?.userErrors?.length > 0) {
            console.error(`✗ Failed to update product ${productId}:`, response.data.productUpdate.userErrors);
        } else {
            console.log(`✓ Updated product: ${response.data.productUpdate.product.title}`);
        }
    } catch (error) {
        console.error(`Error updating product ${productId}:`, error);
    }
}

// --- Main Execution ---

async function main() {
    console.log('Starting Metafields Setup...');

    // 1. Create Definitions
    console.log('\n--- Creating Metafield Definitions ---');
    for (const def of METAFIELD_DEFINITIONS) {
        await createMetafieldDefinition(def);
    }

    // 2. Fetch Products
    console.log('\n--- Fetching Products ---');
    const products = await fetchAllProducts();
    console.log(`Found ${products.length} products.`);

    // 3. Match and Update
    console.log('\n--- Updating Products ---');
    for (const productData of PRODUCTS_DATA) {
        // Find matching product
        const product = products.find(p =>
            productData.handle_keywords.every(kw =>
                p.handle.toLowerCase().includes(kw) || p.title.toLowerCase().includes(kw)
            )
        );

        if (product) {
            console.log(`Matching "${product.title}" for keywords [${productData.handle_keywords.join(', ')}]`);
            await updateProductMetafields(product.id, productData.data);
        } else {
            console.warn(`! No product found matching keywords: [${productData.handle_keywords.join(', ')}]`);
        }
    }

    console.log('\nDone!');
}

main().catch(console.error);
