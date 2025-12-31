// TheMealDB API Service

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string | null;
  strYoutube: string;
  ingredients: Ingredient[];
}

export interface Ingredient {
  name: string;
  measure: string;
}

export interface SimpleMeal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export interface Category {
  strCategory: string;
}

export interface Area {
  strArea: string;
}

// Fetch all categories
export async function fetchCategories(): Promise<string[]> {
  try {
    const response = await fetch(`${BASE_URL}/list.php?c=list`);
    const data = await response.json();
    return data.meals?.map((item: Category) => item.strCategory) || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Fetch all areas
export async function fetchAreas(): Promise<string[]> {
  try {
    const response = await fetch(`${BASE_URL}/list.php?a=list`);
    const data = await response.json();
    return data.meals?.map((item: Area) => item.strArea) || [];
  } catch (error) {
    console.error('Error fetching areas:', error);
    return [];
  }
}

// Fetch meals by category
export async function fetchMealsByCategory(category: string): Promise<SimpleMeal[]> {
  try {
    const response = await fetch(`${BASE_URL}/filter.php?c=${category}`);
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error fetching meals by category:', error);
    return [];
  }
}

// Fetch meals by area
export async function fetchMealsByArea(area: string): Promise<SimpleMeal[]> {
  try {
    const response = await fetch(`${BASE_URL}/filter.php?a=${area}`);
    const data = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error fetching meals by area:', error);
    return [];
  }
}

// Fetch full meal details by ID
export async function fetchMealById(id: string): Promise<Meal | null> {
  try {
    const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
    const data = await response.json();

    if (!data.meals || data.meals.length === 0) {
      return null;
    }

    const meal = data.meals[0];

    // Extract ingredients and measures
    const ingredients: Ingredient[] = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];

      if (ingredient && ingredient.trim()) {
        ingredients.push({
          name: ingredient.trim(),
          measure: measure?.trim() || '',
        });
      }
    }

    return {
      idMeal: meal.idMeal,
      strMeal: meal.strMeal,
      strCategory: meal.strCategory,
      strArea: meal.strArea,
      strInstructions: meal.strInstructions,
      strMealThumb: meal.strMealThumb,
      strTags: meal.strTags,
      strYoutube: meal.strYoutube,
      ingredients,
    };
  } catch (error) {
    console.error('Error fetching meal by ID:', error);
    return null;
  }
}

// Fetch random meal
export async function fetchRandomMeal(): Promise<Meal | null> {
  try {
    const response = await fetch(`${BASE_URL}/random.php`);
    const data = await response.json();

    if (!data.meals || data.meals.length === 0) {
      return null;
    }

    const meal = data.meals[0];
    const ingredients: Ingredient[] = [];

    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];

      if (ingredient && ingredient.trim()) {
        ingredients.push({
          name: ingredient.trim(),
          measure: measure?.trim() || '',
        });
      }
    }

    return {
      idMeal: meal.idMeal,
      strMeal: meal.strMeal,
      strCategory: meal.strCategory,
      strArea: meal.strArea,
      strInstructions: meal.strInstructions,
      strMealThumb: meal.strMealThumb,
      strTags: meal.strTags,
      strYoutube: meal.strYoutube,
      ingredients,
    };
  } catch (error) {
    console.error('Error fetching random meal:', error);
    return null;
  }
}

// Generate weekly meal plan with filters
export async function generateWeeklyPlan(
  filterType: 'category' | 'area' | 'none',
  filterValue: string
): Promise<Meal[]> {
  const meals: Meal[] = [];

  try {
    let simpleMeals: SimpleMeal[] = [];

    if (filterType === 'category' && filterValue) {
      simpleMeals = await fetchMealsByCategory(filterValue);
    } else if (filterType === 'area' && filterValue) {
      simpleMeals = await fetchMealsByArea(filterValue);
    }

    // If we have filtered meals, randomly select 7
    if (simpleMeals.length > 0) {
      const shuffled = [...simpleMeals].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, Math.min(7, shuffled.length));

      // Fetch full details for each meal
      for (const simpleMeal of selected) {
        const fullMeal = await fetchMealById(simpleMeal.idMeal);
        if (fullMeal) {
          meals.push(fullMeal);
        }
      }
    } else {
      // If no filter or no results, get 7 random meals
      for (let i = 0; i < 7; i++) {
        const randomMeal = await fetchRandomMeal();
        if (randomMeal) {
          meals.push(randomMeal);
        }
      }
    }

    return meals;
  } catch (error) {
    console.error('Error generating weekly plan:', error);
    return meals;
  }
}
