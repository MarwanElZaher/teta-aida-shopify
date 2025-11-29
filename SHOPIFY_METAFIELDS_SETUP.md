# Shopify Metafields Setup for Teta Aida

This document outlines all the custom metafields needed to store the extended product content from the specification document.

## Product Metafields

These metafields should be created for **Products** in Shopify Admin.

### 1. Tagline
- **Namespace and Key**: `custom.tagline`
- **Type**: Single line text
- **Description**: Short product tagline (e.g., "Crisp. Light. Naturally refreshing.")
- **Example**: "Rich. Vibrant. Naturally flavorful."

### 2. Micro Trust Badges
- **Namespace and Key**: `custom.micro_trust`
- **Type**: Single line text
- **Description**: Trust badges shown below product name
- **Example**: "Small-batch crafted · Clean ingredients · Signature blend"

### 3. Key Benefits
- **Namespace and Key**: `custom.key_benefits`
- **Type**: JSON
- **Description**: Array of product benefits
- **Example**:
```json
[
  "Crushed Tuffaahy olives mixed with fresh vegetables",
  "Clean ingredients with no artificial additives",
  "Rich, aromatic brine crafted in small batches",
  "Firm crisp texture + colorful premium presentation",
  "A gourmet mezze essential for hosting"
]
```

### 4. Flavor Profile
- **Namespace and Key**: `custom.flavor_profile`
- **Type**: JSON
- **Description**: Object with texture, taste, and finish/health attributes
- **Example**:
```json
{
  "texture": "Firm olive bite + crisp vegetables",
  "taste": "Bright, rich, aromatic, herb-infused",
  "finish": "Clean, smooth, refreshing acidity"
}
```

### 5. Usage Ideas
- **Namespace and Key**: `custom.usage_ideas`
- **Type**: JSON
- **Description**: Array of usage suggestions
- **Example**:
```json
[
  "Hosting tables",
  "Cheese & charcuterie boards",
  "Mezze platters",
  "Daily snacking",
  "Sandwiches & wraps",
  "Pairing with grilled meats"
]
```

### 6. Customer Reviews
- **Namespace and Key**: `custom.reviews`
- **Type**: JSON
- **Description**: Array of customer testimonial quotes
- **Example**:
```json
[
  "The mix is incredible — the peppers and carrots make it addictive.",
  "A premium crushed olive blend. Easily my favorite."
]
```

### 7. Heat Levels Available
- **Namespace and Key**: `custom.heat_levels`
- **Type**: JSON
- **Description**: Array of available heat options for this product
- **Example**:
```json
["Mild", "Normal", "Spicy"]
```

### 8. Bundle Contents (for bundle products only)
- **Namespace and Key**: `custom.bundle_contents`
- **Type**: JSON
- **Description**: Array of products included in the bundle with their details
- **Example**:
```json
[
  {
    "name": "Tuffaahy Olives — Signature Mix",
    "weight": "1Kg",
    "description": "Gently crushed Tuffaahy olives mixed with diced carrots, pepper slices, fresh celery, and aromatic brine."
  },
  {
    "name": "Low-Salt Cucumbers with Celery",
    "weight": "1Kg",
    "description": "Crisp, refreshing, naturally light."
  }
]
```

### 9. Why This Bundle (for bundle products only)
- **Namespace and Key**: `custom.why_bundle`
- **Type**: JSON
- **Description**: Array of reasons why customers should buy this bundle
- **Example**:
```json
[
  "Ideal for first-time buyers",
  "Perfect for gifting & hosting",
  "Balanced flavor selection",
  "Premium presentation",
  "Most popular Teta Aida bundle"
]
```

### 10. Usage Moments (for bundle products only)
- **Namespace and Key**: `custom.usage_moments`
- **Type**: JSON
- **Description**: Array of occasions/moments for using this bundle
- **Example**:
```json
[
  "Dinner parties",
  "Cheese boards & mezze tables",
  "Family gatherings",
  "Gourmet gifting",
  "Cooking enhancements"
]
```

---

## Sample Data for Each Product

### Product 1: Tuffaahy Olives — Signature Mix

```json
{
  "title": "Tuffaahy Olives — Signature Mix",
  "handle": "tuffaahy-olives-signature-mix",
  "description": "Premium Tuffaahy green olives, gently crushed and mixed with diced carrots, pepper slices, fresh celery, and our signature aromatic brine. A rich, vibrant, and perfectly balanced gourmet experience.",
  "metafields": {
    "custom.tagline": "Crushed, vibrant, and naturally flavorful.",
    "custom.micro_trust": "Small-batch crafted · Clean ingredients · Signature blend",
    "custom.key_benefits": [
      "Crushed Tuffaahy olives mixed with fresh vegetables",
      "Clean ingredients with no artificial additives",
      "Rich, aromatic brine crafted in small batches",
      "Firm crisp texture + colorful premium presentation",
      "A gourmet mezze essential for hosting"
    ],
    "custom.flavor_profile": {
      "texture": "Firm olive bite + crisp vegetables",
      "taste": "Bright, rich, aromatic, herb-infused",
      "finish": "Clean, smooth, refreshing acidity"
    },
    "custom.usage_ideas": [
      "Hosting tables",
      "Cheese & charcuterie boards",
      "Mezze platters",
      "Daily snacking",
      "Sandwiches & wraps",
      "Pairing with grilled meats"
    ],
    "custom.reviews": [
      "The mix is incredible — the peppers and carrots make it addictive.",
      "A premium crushed olive blend. Easily my favorite."
    ],
    "custom.heat_levels": ["Mild", "Normal", "Spicy"]
  }
}
```

### Product 2: Low-Salt Cucumbers with Celery

```json
{
  "title": "Low-Salt Cucumbers with Celery",
  "handle": "low-salt-cucumbers-celery",
  "description": "Crisp cucumbers pickled lightly with fresh celery. Naturally low in salt, crafted for clean eating and everyday enjoyment.",
  "metafields": {
    "custom.tagline": "Crisp. Light. Naturally refreshing.",
    "custom.micro_trust": "Low salt · Clean ingredients · Small-batch crafted",
    "custom.key_benefits": [
      "Naturally low in salt",
      "Light, refreshing, crisp",
      "Clean ingredients only",
      "Perfect for wellness-focused customers",
      "Small-batch crafted"
    ],
    "custom.flavor_profile": {
      "texture": "Firm, crunchy",
      "taste": "Light, bright, refreshing",
      "salt_level": "Very low, health-friendly"
    },
    "custom.usage_ideas": [
      "Healthy lunches",
      "Post-gym snack",
      "Snack bowls",
      "Mezze tables",
      "Sandwiches & wraps"
    ],
    "custom.reviews": [
      "Finally a low-salt pickle that tastes amazing.",
      "My daily healthy go-to."
    ],
    "custom.heat_levels": ["Mild", "Normal"]
  }
}
```

### Product 3: Tangerine-Infused Cabbage

```json
{
  "title": "Tangerine-Infused Cabbage",
  "handle": "tangerine-cabbage",
  "description": "Crisp, naturally fermented cabbage gently infused with natural Tangerine essence. Good for stomach & colon relief. Light acidity, refreshing citrus aroma, rich probiotics.",
  "metafields": {
    "custom.tagline": "Probiotic. Crisp. Refreshing citrus.",
    "custom.micro_trust": "Probiotic · Naturally fermented · Clean ingredients",
    "custom.key_benefits": [
      "Naturally fermented (probiotic)",
      "Clean, natural ingredients",
      "Crisp, refreshing texture",
      "Light citrus aroma",
      "Great for wellness-focused consumers"
    ],
    "custom.flavor_profile": {
      "texture": "Crunchy, crisp",
      "taste": "Bright, lightly tangy with citrus notes",
      "health": "Naturally probiotic"
    },
    "custom.usage_ideas": [
      "Healthy bowls",
      "Salads",
      "Sandwiches",
      "Side for chicken or fish",
      "Mezze tables"
    ],
    "custom.reviews": [
      "Light, refreshing, addictive.",
      "The Tangerine twist is brilliant."
    ],
    "custom.heat_levels": ["Mild", "Normal"]
  }
}
```

### Product 4: Half-Preserved Lemons with Harissa

```json
{
  "title": "Half-Preserved Lemons with Harissa",
  "handle": "harissa-lemons",
  "description": "Premium lemons cut into halves and infused with bold harissa and black seeds. A rich, spicy blend crafted for cooking, marinating, and gourmet hosting.",
  "metafields": {
    "custom.tagline": "Bold. Spicy or not. Full of character.",
    "custom.micro_trust": "Small-batch crafted · Clean ingredients · Rich flavor",
    "custom.key_benefits": [
      "Intense, bold harissa infusion",
      "Perfect for cooking & marinades",
      "Clean ingredients",
      "Small-batch consistency",
      "Ideal for gourmet hosting"
    ],
    "custom.flavor_profile": {
      "texture": "Soft peel, rich sauce",
      "taste": "Spicy, zesty, aromatic",
      "heat_level": "Medium–hot"
    },
    "custom.usage_ideas": [
      "Roast chicken",
      "Fish marinades",
      "BBQ plates",
      "Mezze boards",
      "Pasta sauces"
    ],
    "custom.reviews": [
      "Perfect taste, the best lemon ever, after taste is an experience itself",
      "These lemons take dishes to another level.",
      "A must-have for cooking."
    ],
    "custom.heat_levels": ["Mild", "Spicy"]
  }
}
```

---

## Bundle Products

### Bundle 1: Signature Box

```json
{
  "title": "Signature Box",
  "handle": "signature-box",
  "description": "The complete Teta Aida experience — small-batch artisanal flavors crafted with clean, natural ingredients.",
  "metafields": {
    "custom.tagline": "All Four Premium Flavors, One Elegant Box",
    "custom.micro_trust": "Fresh weekly · Small-batch crafted · Clean ingredients",
    "custom.bundle_contents": [
      {
        "name": "Tuffaahy Olives — Signature Mix",
        "weight": "1Kg",
        "description": "Gently crushed Tuffaahy olives mixed with diced carrots, pepper slices, fresh celery, and aromatic brine."
      },
      {
        "name": "Low-Salt Cucumbers with Celery",
        "weight": "1Kg",
        "description": "Crisp, refreshing, naturally light."
      },
      {
        "name": "Tangerine-Infused Cabbage",
        "weight": "1Kg",
        "description": "Naturally fermented, probiotic, citrus twist."
      },
      {
        "name": "Half Lemons with Harissa",
        "weight": "1Kg",
        "description": "Bold, spicy, perfect for cooking & hosting."
      }
    ],
    "custom.why_bundle": [
      "Ideal for first-time buyers",
      "Perfect for gifting & hosting",
      "Balanced flavor selection",
      "Premium presentation",
      "Most popular Teta Aida bundle"
    ],
    "custom.usage_moments": [
      "Dinner parties",
      "Cheese boards & mezze tables",
      "Family gatherings",
      "Gourmet gifting",
      "Cooking enhancements"
    ],
    "custom.reviews": [
      "Each jar tastes completely different — in the best way.",
      "A beautiful gift.",
      "The perfect introduction to the brand."
    ]
  }
}
```

### Bundle 2: Healthy Living Box

```json
{
  "title": "Healthy Living Box",
  "handle": "healthy-living-box",
  "description": "A wellness-focused bundle made with low-salt and probiotic-rich flavors.",
  "metafields": {
    "custom.tagline": "Clean, Light & Naturally Healthy",
    "custom.micro_trust": "Low salt · Naturally fermented · Clean ingredients",
    "custom.bundle_contents": [
      {
        "name": "Low-Salt Cucumbers with Celery",
        "weight": "1Kg",
        "description": "Crisp, refreshing, crafted for healthy living."
      },
      {
        "name": "Tangerine-Infused Cabbage",
        "weight": "1Kg",
        "description": "Naturally fermented, probiotic, citrus aroma."
      }
    ],
    "custom.why_bundle": [
      "Ideal for clean-eating lifestyles",
      "Light on the stomach",
      "Great daily fridge essential",
      "Wellness-conscious selection",
      "Premium quality, elegant packaging"
    ],
    "custom.usage_moments": [
      "Healthy lunches",
      "Gym meals",
      "Light dinners",
      "Post-workout snacks",
      "Clean ingredient meal prep"
    ],
    "custom.reviews": [
      "Finally a low-salt pickle that tastes amazing.",
      "My everyday healthy go-to."
    ]
  }
}
```

### Bundle 3: Spicy Lovers Box

```json
{
  "title": "Spicy Lovers Box",
  "handle": "spicy-lovers-box",
  "description": "A curated selection of Teta Aida's richest, most aromatic, spicy creations.",
  "metafields": {
    "custom.tagline": "For Lovers of Bold, Fiery Flavor",
    "custom.micro_trust": "Bold flavors · Aromatic blends · Small-batch crafted",
    "custom.bundle_contents": [
      {
        "name": "Tuffaahy Olives — Signature Mix",
        "weight": "1Kg",
        "description": "Crushed Tuffaahy olives with vegetables and aromatic brine — rich flavor base for every mezze."
      },
      {
        "name": "Half Lemons with Harissa",
        "weight": "1Kg",
        "description": "Fiery, bold, unforgettable."
      }
    ],
    "custom.why_bundle": [
      "Perfect for spice lovers",
      "Adds bold flavor to any meal",
      "Great for cooking & marinades",
      "Premium mezze choice",
      "Rich, aromatic combinations"
    ],
    "custom.usage_moments": [
      "Seasoning for chicken & meats",
      "Mezze boards",
      "BBQ plates",
      "Sandwiches",
      "Hosting nights"
    ],
    "custom.reviews": [
      "The harissa lemons are insane — addictive.",
      "Amazing bold flavors."
    ]
  }
}
```

### Bundle 4: Hosting Box

```json
{
  "title": "Hosting Box",
  "handle": "hosting-box",
  "description": "A curated bundle designed to elevate any hosting experience.",
  "metafields": {
    "custom.tagline": "Made for Elegant Tables & Special Gatherings",
    "custom.micro_trust": "Elegant presentation · Premium jars · Guest-approved",
    "custom.bundle_contents": [
      {
        "name": "Tuffaahy Olives — Signature Mix",
        "weight": "2Kg (2x 1Kg)",
        "description": "Perfect for mezze tables & sharing."
      },
      {
        "name": "Half Lemons with Harissa",
        "weight": "1Kg",
        "description": "Bold and unforgettable for hostess platters."
      },
      {
        "name": "Choice: Tangerine Cabbage OR Low-Salt Cucumbers",
        "weight": "1Kg",
        "description": "Choose your preferred hosting style — refreshing or healthy."
      }
    ],
    "custom.why_bundle": [
      "Perfect for guests",
      "Enhances table presentation",
      "Balanced flavors for all palates",
      "Premium for brunch, dinner, or celebrations",
      "Ideal gourmet gift"
    ],
    "custom.usage_moments": [
      "Dinner parties",
      "Brunch gatherings",
      "Cheese & charcuterie boards",
      "Special occasions",
      "Family hosting"
    ],
    "custom.reviews": [
      "This box transformed our table.",
      "Guests kept asking where it's from."
    ]
  }
}
```

---

## How to Create Metafields in Shopify Admin

### Option 1: Manual Setup (Shopify Admin UI)

1. Go to **Settings** → **Custom data** → **Products**
2. Click **Add definition**
3. For each metafield above:
   - Enter the **Name** (e.g., "Tagline")
   - Set **Namespace and key** (e.g., `custom.tagline`)
   - Select **Type** (Single line text, JSON, etc.)
   - Add **Description**
   - Click **Save**

4. After creating metafield definitions, go to each product:
   - Navigate to **Products** → Select a product
   - Scroll to **Metafields** section
   - Fill in the values for each metafield

### Option 2: Programmatic Setup (Admin API)

I can create a Node.js script that uses the Shopify Admin API to:
1. Create all metafield definitions
2. Populate all products with their metafield data
3. Create the 4 bundle products with all their data

This would be much faster than manual entry. Would you like me to create this script?

---

## Next Steps

1. **Create Products in Shopify Admin**: Create the 4 individual products and 4 bundle products
2. **Set Up Metafields**: Either manually or via script
3. **Populate Metafield Data**: Add all the content from the specification document
4. **Update Hydrogen App**: Modify GraphQL queries to fetch metafields and render them dynamically

All orders will automatically appear in Shopify Admin once the Hydrogen app is connected to your store!
