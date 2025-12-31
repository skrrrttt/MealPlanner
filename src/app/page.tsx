'use client';

import { useState, useEffect } from 'react';
import { ChefHat, RefreshCw } from 'lucide-react';
import { useMealStore } from '@/store/useMealStore';
import { fetchCategories, fetchAreas, generateWeeklyPlan, Meal } from '@/services/api';
import { RecipeModal } from '@/components/RecipeModal';

export default function Home() {
  const { weeklyPlan, setWeeklyPlan, setSelectedMeal, isLoading, setIsLoading } = useMealStore();

  const [categories, setCategories] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);

  // New multi-filter system
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedMealTypes, setSelectedMealTypes] = useState<string[]>(['lunch', 'dinner']);
  const [selectedDays, setSelectedDays] = useState<string[]>(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Dessert'];
  const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Popular diet plans with keyword mappings
  const diets = [
    { name: 'Mediterranean', keywords: ['Seafood', 'Italian', 'Greek', 'Spanish'] },
    { name: 'Anti-Inflammatory', keywords: ['Seafood', 'Vegetarian', 'Vegan'] },
    { name: 'Heart Healthy', keywords: ['Seafood', 'Vegetarian', 'Chicken'] },
    { name: 'Low Carb', keywords: ['Seafood', 'Beef', 'Chicken', 'Pork'] },
    { name: 'Plant Based', keywords: ['Vegetarian', 'Vegan'] },
    { name: 'Gluten Free', keywords: ['Seafood', 'Beef', 'Chicken', 'Lamb'] },
  ];

  // Load filters on mount
  useEffect(() => {
    async function loadFilters() {
      const [cats, ars] = await Promise.all([fetchCategories(), fetchAreas()]);
      setCategories(cats);
      setAreas(ars);
    }
    loadFilters();
  }, []);

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    try {
      // Build category filters from selected diets
      const categoryFilters: string[] = [];
      selectedDiets.forEach(dietName => {
        const diet = diets.find(d => d.name === dietName);
        if (diet) {
          categoryFilters.push(...diet.keywords);
        }
      });

      // Combine with selected cuisines as area filters
      const areaFilters = [...selectedCuisines];

      // Generate a larger pool of meals to filter from
      const numMealsNeeded = selectedDays.length;
      const poolSize = Math.max(20, numMealsNeeded * 2);
      const mealPool: Meal[] = [];

      // Fetch meals based on filters or random
      if (categoryFilters.length > 0 || areaFilters.length > 0) {
        // Use first category filter if available
        const filterType = categoryFilters.length > 0 ? 'category' : (areaFilters.length > 0 ? 'area' : 'none');
        const filterValue = categoryFilters.length > 0 ? categoryFilters[0] : (areaFilters.length > 0 ? areaFilters[0] : '');

        const meals = await generateWeeklyPlan(filterType, filterValue);
        mealPool.push(...meals);

        // If we need more meals, fetch additional random ones
        while (mealPool.length < poolSize) {
          const moreMeals = await generateWeeklyPlan('none', '');
          mealPool.push(...moreMeals);
        }
      } else {
        // No filters, get random meals
        const meals = await generateWeeklyPlan('none', '');
        mealPool.push(...meals);
      }

      // Filter meals by category and area
      const filteredMeals = mealPool.filter(meal => {
        const matchesCategory = categoryFilters.length === 0 ||
          categoryFilters.includes(meal.strCategory);
        const matchesArea = areaFilters.length === 0 ||
          areaFilters.includes(meal.strArea);
        return matchesCategory && matchesArea;
      });

      // Create a meals array for all 7 days
      const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const mealsForWeek: Meal[] = [];

      let mealIndex = 0;
      for (let i = 0; i < 7; i++) {
        const day = allDays[i];
        if (selectedDays.includes(day) && mealIndex < filteredMeals.length) {
          mealsForWeek.push(filteredMeals[mealIndex]);
          mealIndex++;
        } else {
          // Push a placeholder - the store will convert to null
          // For now, just skip and let the store handle it
        }
      }

      setWeeklyPlan(mealsForWeek);
    } catch (error) {
      console.error('Failed to generate plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMealType = (type: string) => {
    setSelectedMealTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleDay = (day: string) => {
    setSelectedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const toggleDiet = (dietName: string) => {
    setSelectedDiets(prev =>
      prev.includes(dietName) ? prev.filter(d => d !== dietName) : [...prev, dietName]
    );
  };

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines(prev =>
      prev.includes(cuisine) ? prev.filter(c => c !== cuisine) : [...prev, cuisine]
    );
  };

  return (
    <>
      <div className="h-full flex flex-col bg-ios-gray-1">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 safe-top shadow-lg flex-shrink-0">
          <div className="px-4 py-5">
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3 drop-shadow-lg">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <ChefHat size={32} strokeWidth={2.5} />
              </div>
              Meal Planner
            </h1>
          </div>

          {/* Filters */}
          <div className="px-4 pb-5 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {/* Meal Types */}
            <div>
              <label className="block text-white text-xs font-bold uppercase tracking-wide mb-2">
                Meal Types
              </label>
              <div className="grid grid-cols-2 gap-2">
                {mealTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleMealType(type.toLowerCase())}
                    className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all transform active:scale-95 ${
                      selectedMealTypes.includes(type.toLowerCase())
                        ? 'bg-white text-purple-600 shadow-md'
                        : 'bg-white/20 text-white backdrop-blur-sm'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Days */}
            <div>
              <label className="block text-white text-xs font-bold uppercase tracking-wide mb-2">
                Days
              </label>
              <div className="grid grid-cols-4 gap-2">
                {allDays.map((day) => (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`py-2.5 px-2 rounded-xl font-bold text-[10px] transition-all transform active:scale-95 ${
                      selectedDays.includes(day)
                        ? 'bg-white text-purple-600 shadow-md'
                        : 'bg-white/20 text-white backdrop-blur-sm'
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* Diet Plans */}
            <div>
              <label className="block text-white text-xs font-bold uppercase tracking-wide mb-2">
                Diet Plans (Optional)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {diets.map((diet) => (
                  <button
                    key={diet.name}
                    onClick={() => toggleDiet(diet.name)}
                    className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all transform active:scale-95 ${
                      selectedDiets.includes(diet.name)
                        ? 'bg-white text-orange-600 shadow-md'
                        : 'bg-white/20 text-white backdrop-blur-sm'
                    }`}
                  >
                    {diet.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Cuisines */}
            <div>
              <label className="block text-white text-xs font-bold uppercase tracking-wide mb-2">
                Cuisines (Optional)
              </label>
              <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto custom-scrollbar">
                {areas.map((area) => (
                  <button
                    key={area}
                    onClick={() => toggleCuisine(area)}
                    className={`py-2.5 px-2 rounded-xl font-bold text-[10px] transition-all transform active:scale-95 ${
                      selectedCuisines.includes(area)
                        ? 'bg-white text-blue-600 shadow-md'
                        : 'bg-white/20 text-white backdrop-blur-sm'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGeneratePlan}
              disabled={isLoading}
              className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ minHeight: '48px' }}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={22} className="animate-spin" />
                  <span className="text-base">Generating...</span>
                </>
              ) : (
                <>
                  <RefreshCw size={22} />
                  <span className="text-base">Generate Weekly Plan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Weekly Plan */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
          {weeklyPlan.map((dayPlan, index) => {
            const dayColors = [
              'from-red-500 to-orange-500',
              'from-orange-500 to-amber-500',
              'from-amber-500 to-yellow-500',
              'from-emerald-500 to-teal-500',
              'from-cyan-500 to-blue-500',
              'from-blue-500 to-indigo-500',
              'from-purple-500 to-pink-500',
            ];
            const gradientClass = dayColors[index % 7];

            return (
              <div
                key={dayPlan.day}
                className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] overflow-hidden border border-gray-200"
              >
                {dayPlan.meal ? (
                  <button
                    onClick={() => setSelectedMeal(dayPlan.meal)}
                    className="w-full text-left"
                  >
                    <div className="flex gap-4 p-4">
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden shadow-md">
                        <img
                          src={dayPlan.meal.strMealThumb}
                          alt={dayPlan.meal.strMeal}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent"></div>
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className={`inline-block self-start px-3 py-1 bg-gradient-to-r ${gradientClass} text-white text-xs font-bold uppercase tracking-wide rounded-full mb-2 shadow-md`}>
                          {dayPlan.day}
                        </div>
                        <h3 className="text-base font-extrabold text-gray-900 line-clamp-2 mb-1.5 leading-tight">
                          {dayPlan.meal.strMeal}
                        </h3>
                        <div className="flex gap-2 text-xs">
                          <span className="px-2 py-0.5 bg-orange-100 text-orange-700 font-semibold rounded-full">
                            {dayPlan.meal.strCategory}
                          </span>
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 font-semibold rounded-full">
                            {dayPlan.meal.strArea}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ) : (
                  <div className="p-5">
                    <div className={`inline-block px-3 py-1 bg-gradient-to-r ${gradientClass} text-white text-xs font-bold uppercase tracking-wide rounded-full mb-2`}>
                      {dayPlan.day}
                    </div>
                    <p className="text-sm text-gray-400 italic">No meal planned</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <RecipeModal />
    </>
  );
}
