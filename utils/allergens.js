export const ALLERGENS = {
  nuts: ["almond", "cashew", "walnut", "pecan", "pistachio", "hazelnut", "macadamia", "tree nut"],
  dairy: ["milk", "cheese", "butter", "cream", "whey", "lactose", "casein", "yogurt"],
  wheat: ["wheat", "flour", "gluten", "bread", "pasta"]
};

// function to detects allergens
export function detectAllergens(text) {
  const lower = text.toLowerCase();
  const found = {
    nuts: false,
    dairy: false,
    wheat: false,
    details: []
  };

  // Check for nuts
  ALLERGENS.nuts.forEach(item => {
    if (lower.includes(item)) {
      found.nuts = true;
      found.details.push(`Contains: ${item}`);
    }
  });

  // Check for dairy
  ALLERGENS.dairy.forEach(item => {
    if (lower.includes(item)) {
      found.dairy = true;
      found.details.push(`Contains: ${item}`);
    }
  });

  // Check for wheat
  ALLERGENS.wheat.forEach(item => {
    if (lower.includes(item)) {
      found.wheat = true;
      found.details.push(`Contains: ${item}`);
    }
  });

  return found;
}