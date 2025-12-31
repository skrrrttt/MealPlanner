// Zustand Store for Meal Plan and Grocery List

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Meal } from '@/services/api';
import { GroceryList, CategorizedIngredient, aggregateGroceryList } from '@/services/listHelper';

export interface MealSlot {
  type: 'breakfast' | 'lunch' | 'dinner' | 'dessert';
  meal: Meal | null;
}

export interface DayPlan {
  day: string;
  meals: MealSlot[];
}

interface MealStore {
  // Weekly Plan
  weeklyPlan: DayPlan[];
  setWeeklyPlan: (plan: DayPlan[]) => void;
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
      weeklyPlan: DAYS.map((day) => ({ day, meals: [] })),
      groceryList: {},
      selectedMeal: null,
      isLoading: false,

      // Weekly Plan Actions
      setWeeklyPlan: (plan: DayPlan[]) => {
        set({ weeklyPlan: plan });

        // Auto-generate grocery list when plan is updated
        const allMeals = plan.flatMap(day =>
          day.meals.map(slot => slot.meal).filter((m): m is Meal => m !== null)
        );
        const groceryList = aggregateGroceryList(allMeals);
        set({ groceryList });
      },

      clearWeeklyPlan: () => {
        const emptyPlan = DAYS.map((day) => ({ day, meals: [] }));
        set({ weeklyPlan: emptyPlan, groceryList: {} });
      },

      // Grocery List Actions
      generateGroceryList: () => {
        const { weeklyPlan } = get();
        const allMeals = weeklyPlan.flatMap(day =>
          day.meals.map(slot => slot.meal).filter((m): m is Meal => m !== null)
        );
        const groceryList = aggregateGroceryList(allMeals);
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
