// Grocery List Helper - Categorization and Sorting

import { Ingredient, Meal } from './api';

export type AisleCategory =
  | 'Produce'
  | 'Meat & Seafood'
  | 'Dairy & Eggs'
  | 'Bakery & Bread'
  | 'Pantry & Dry Goods'
  | 'Spices & Seasonings'
  | 'Oils & Condiments'
  | 'Beverages'
  | 'Frozen'
  | 'Other';

export interface CategorizedIngredient extends Ingredient {
  category: AisleCategory;
  inPantry: boolean;
  inCart: boolean;
}

export interface GroceryList {
  [category: string]: CategorizedIngredient[];
}

// Aisle sorting order (matches typical grocery store layout)
const AISLE_ORDER: AisleCategory[] = [
  'Produce',
  'Meat & Seafood',
  'Dairy & Eggs',
  'Bakery & Bread',
  'Frozen',
  'Pantry & Dry Goods',
  'Spices & Seasonings',
  'Oils & Condiments',
  'Beverages',
  'Other',
];

// Categorize ingredient based on keywords
export function categorizeIngredient(ingredientName: string): AisleCategory {
  const name = ingredientName.toLowerCase();

  // Produce
  if (
    /\b(onion|garlic|tomato|pepper|lettuce|spinach|carrot|celery|potato|mushroom|ginger|herb|basil|parsley|cilantro|thyme|rosemary|mint|lemon|lime|apple|banana|avocado|cucumber|zucchini|broccoli|cauliflower|cabbage|kale|arugula|corn|peas|green beans|asparagus)\b/.test(
      name
    )
  ) {
    return 'Produce';
  }

  // Meat & Seafood
  if (
    /\b(chicken|beef|pork|lamb|turkey|duck|bacon|sausage|ham|steak|ground|mince|fish|salmon|tuna|shrimp|prawns|crab|lobster|cod|tilapia|mussels|clams|scallops|anchov)\b/.test(
      name
    )
  ) {
    return 'Meat & Seafood';
  }

  // Dairy & Eggs
  if (
    /\b(milk|cream|cheese|butter|yogurt|egg|parmesan|mozzarella|cheddar|feta|ricotta|sour cream|cottage cheese|whipped cream)\b/.test(
      name
    )
  ) {
    return 'Dairy & Eggs';
  }

  // Bakery & Bread
  if (/\b(bread|bun|roll|baguette|tortilla|pita|naan|croissant|bagel|muffin)\b/.test(name)) {
    return 'Bakery & Bread';
  }

  // Frozen
  if (/\b(frozen|ice cream)\b/.test(name)) {
    return 'Frozen';
  }

  // Spices & Seasonings
  if (
    /\b(salt|pepper|paprika|cumin|coriander|turmeric|cinnamon|nutmeg|cardamom|cloves|oregano|bay|chili|curry|cayenne|allspice|sage|dill|tarragon|fennel|saffron|vanilla)\b/.test(
      name
    )
  ) {
    return 'Spices & Seasonings';
  }

  // Oils & Condiments
  if (
    /\b(oil|olive oil|vegetable oil|vinegar|mayonnaise|mustard|ketchup|sauce|soy sauce|fish sauce|worcester|tahini|pesto|salsa|hot sauce|bbq|honey|maple syrup|jam|jelly|pickle)\b/.test(
      name
    )
  ) {
    return 'Oils & Condiments';
  }

  // Beverages
  if (
    /\b(water|juice|soda|coffee|tea|wine|beer|liquor|bourbon|rum|vodka|brandy|stock|broth)\b/.test(
      name
    )
  ) {
    return 'Beverages';
  }

  // Pantry & Dry Goods
  if (
    /\b(flour|sugar|rice|pasta|noodle|beans|lentil|chickpea|oat|quinoa|couscous|cereal|crackers|chips|nuts|almond|cashew|peanut|walnut|raisin|chocolate|cocoa|baking|yeast|cornstarch|baking powder|baking soda|breadcrumb)\b/.test(
      name
    )
  ) {
    return 'Pantry & Dry Goods';
  }

  // Default
  return 'Other';
}

// Aggregate and categorize ingredients from multiple meals
export function aggregateGroceryList(meals: Meal[]): GroceryList {
  const ingredientMap = new Map<string, CategorizedIngredient>();

  // Collect all ingredients
  meals.forEach((meal) => {
    meal.ingredients.forEach((ingredient) => {
      const key = ingredient.name.toLowerCase();

      if (ingredientMap.has(key)) {
        // If ingredient already exists, append the measure
        const existing = ingredientMap.get(key)!;
        if (ingredient.measure && !existing.measure.includes(ingredient.measure)) {
          existing.measure = existing.measure
            ? `${existing.measure} + ${ingredient.measure}`
            : ingredient.measure;
        }
      } else {
        // Add new ingredient
        ingredientMap.set(key, {
          name: ingredient.name,
          measure: ingredient.measure,
          category: categorizeIngredient(ingredient.name),
          inPantry: false,
          inCart: false,
        });
      }
    });
  });

  // Group by category
  const groceryList: GroceryList = {};

  ingredientMap.forEach((ingredient) => {
    if (!groceryList[ingredient.category]) {
      groceryList[ingredient.category] = [];
    }
    groceryList[ingredient.category].push(ingredient);
  });

  // Sort each category alphabetically
  Object.keys(groceryList).forEach((category) => {
    groceryList[category].sort((a, b) => a.name.localeCompare(b.name));
  });

  return groceryList;
}

// Get sorted aisle categories
export function getSortedCategories(groceryList: GroceryList): AisleCategory[] {
  const availableCategories = Object.keys(groceryList) as AisleCategory[];
  return AISLE_ORDER.filter((category) => availableCategories.includes(category));
}

// Get total item count
export function getTotalItemCount(groceryList: GroceryList): number {
  return Object.values(groceryList).reduce((sum, items) => sum + items.length, 0);
}

// Get active item count (not in pantry)
export function getActiveItemCount(groceryList: GroceryList): number {
  return Object.values(groceryList).reduce(
    (sum, items) => sum + items.filter((item) => !item.inPantry).length,
    0
  );
}

// Get checked item count (in cart)
export function getCheckedItemCount(groceryList: GroceryList): number {
  return Object.values(groceryList).reduce(
    (sum, items) => sum + items.filter((item) => item.inCart).length,
    0
  );
}
