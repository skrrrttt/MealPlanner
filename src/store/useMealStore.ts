// Zustand Store for Meal Plan and Grocery List

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Meal } from '@/services/api';
import { GroceryList, CategorizedIngredient, aggregateGroceryList } from '@/services/listHelper';

export interface DayPlan {
  day: string;
  meal: Meal | null;
}

interface MealStore {
  // Weekly Plan
  weeklyPlan: DayPlan[];
  setWeeklyPlan: (meals: Meal[]) => void;
  clearWeeklyPlan: () => void;

  // Grocery List
  groceryList: GroceryList;
  generateGroceryList: () => void;
  toggleInPantry: (category: string, ingredientName: string) => void;
  toggleInCart: (category: string, ingredientName: string) => void;
  clearGroceryList: () => void;

  // UI State
  selectedMeal: Meal | null;
  setSelectedMeal: (meal: Meal | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const useMealStore = create<MealStore>()(
  persist(
    (set, get) => ({
      // Initial State
      weeklyPlan: DAYS.map((day) => ({ day, meal: null })),
      groceryList: {},
      selectedMeal: null,
      isLoading: false,

      // Weekly Plan Actions
      setWeeklyPlan: (meals: Meal[]) => {
        const plan = DAYS.map((day, index) => ({
          day,
          meal: meals[index] || null,
        }));
        set({ weeklyPlan: plan });

        // Auto-generate grocery list when plan is updated
        const groceryList = aggregateGroceryList(meals);
        set({ groceryList });
      },

      clearWeeklyPlan: () => {
        const emptyPlan = DAYS.map((day) => ({ day, meal: null }));
        set({ weeklyPlan: emptyPlan, groceryList: {} });
      },

      // Grocery List Actions
      generateGroceryList: () => {
        const { weeklyPlan } = get();
        const meals = weeklyPlan.map((d) => d.meal).filter((m): m is Meal => m !== null);
        const groceryList = aggregateGroceryList(meals);
        set({ groceryList });
      },

      toggleInPantry: (category: string, ingredientName: string) => {
        const { groceryList } = get();
        const updatedList = { ...groceryList };

        if (updatedList[category]) {
          updatedList[category] = updatedList[category].map((item) =>
            item.name.toLowerCase() === ingredientName.toLowerCase()
              ? { ...item, inPantry: !item.inPantry }
              : item
          );
        }

        set({ groceryList: updatedList });
      },

      toggleInCart: (category: string, ingredientName: string) => {
        const { groceryList } = get();
        const updatedList = { ...groceryList };

        if (updatedList[category]) {
          updatedList[category] = updatedList[category].map((item) =>
            item.name.toLowerCase() === ingredientName.toLowerCase()
              ? { ...item, inCart: !item.inCart }
              : item
          );
        }

        set({ groceryList: updatedList });
      },

      clearGroceryList: () => {
        set({ groceryList: {} });
      },

      // UI State Actions
      setSelectedMeal: (meal: Meal | null) => {
        set({ selectedMeal: meal });
      },

      setIsLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'meal-planner-storage',
      // Only persist these fields
      partialize: (state) => ({
        weeklyPlan: state.weeklyPlan,
        groceryList: state.groceryList,
      }),
    }
  )
);
