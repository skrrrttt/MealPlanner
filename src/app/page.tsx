'use client';

import { useState, useEffect } from 'react';
import { ChefHat, RefreshCw } from 'lucide-react';
import { useMealStore } from '@/store/useMealStore';
import { fetchCategories, fetchAreas, generateWeeklyPlan } from '@/services/api';
import { RecipeModal } from '@/components/RecipeModal';

export default function Home() {
  const { weeklyPlan, setWeeklyPlan, setSelectedMeal, isLoading, setIsLoading } = useMealStore();

  const [categories, setCategories] = useState<string[]>([]);
  const [areas, setAreas] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<'none' | 'category' | 'area' | 'diet'>('none');
  const [filterValue, setFilterValue] = useState('');

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
      let finalFilterType: 'category' | 'area' | 'none' = filterType === 'diet' ? 'category' : filterType;
      let finalFilterValue = filterValue;

      // Handle diet filter by mapping to category
      if (filterType === 'diet' && filterValue) {
        const selectedDiet = diets.find(d => d.name === filterValue);
        if (selectedDiet && selectedDiet.keywords.length > 0) {
          // Pick a random keyword from the diet
          const randomKeyword = selectedDiet.keywords[Math.floor(Math.random() * selectedDiet.keywords.length)];
          finalFilterType = 'category';
          finalFilterValue = randomKeyword;
        }
      }

      const meals = await generateWeeklyPlan(finalFilterType, finalFilterValue);
      setWeeklyPlan(meals);
    } catch (error) {
      console.error('Failed to generate plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterTypeChange = (type: 'none' | 'category' | 'area' | 'diet') => {
    setFilterType(type);
    setFilterValue('');
  };

  return (
    <>
      <div className="h-full flex flex-col bg-ios-gray-1">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 safe-top shadow-lg">
          <div className="px-4 py-5">
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3 drop-shadow-lg">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <ChefHat size={32} strokeWidth={2.5} />
              </div>
              Meal Planner
            </h1>
          </div>

          {/* Filters */}
          <div className="px-4 pb-5 space-y-3">
            {/* Filter Type */}
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => handleFilterTypeChange('none')}
                className={`py-2.5 px-2 rounded-xl font-bold text-xs transition-all transform active:scale-95 ${
                  filterType === 'none'
                    ? 'bg-white text-purple-600 shadow-md scale-105'
                    : 'bg-white/20 text-white backdrop-blur-sm hover:bg-white/30'
                }`}
              >
                Random
              </button>
              <button
                onClick={() => handleFilterTypeChange('diet')}
                className={`py-2.5 px-2 rounded-xl font-bold text-xs transition-all transform active:scale-95 ${
                  filterType === 'diet'
                    ? 'bg-white text-purple-600 shadow-md scale-105'
                    : 'bg-white/20 text-white backdrop-blur-sm hover:bg-white/30'
                }`}
              >
                Diet
              </button>
              <button
                onClick={() => handleFilterTypeChange('category')}
                className={`py-2.5 px-2 rounded-xl font-bold text-xs transition-all transform active:scale-95 ${
                  filterType === 'category'
                    ? 'bg-white text-purple-600 shadow-md scale-105'
                    : 'bg-white/20 text-white backdrop-blur-sm hover:bg-white/30'
                }`}
              >
                Category
              </button>
              <button
                onClick={() => handleFilterTypeChange('area')}
                className={`py-2.5 px-2 rounded-xl font-bold text-xs transition-all transform active:scale-95 ${
                  filterType === 'area'
                    ? 'bg-white text-purple-600 shadow-md scale-105'
                    : 'bg-white/20 text-white backdrop-blur-sm hover:bg-white/30'
                }`}
              >
                Cuisine
              </button>
            </div>

            {/* Filter Value */}
            {filterType === 'category' && (
              <select
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="w-full py-3 px-4 rounded-xl bg-white border-2 border-white/30 text-gray-900 font-bold shadow-lg focus:ring-2 focus:ring-white/50 focus:border-white transition-all"
                style={{ minHeight: '48px' }}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}

            {filterType === 'area' && (
              <select
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="w-full py-3 px-4 rounded-xl bg-white border-2 border-white/30 text-gray-900 font-bold shadow-lg focus:ring-2 focus:ring-white/50 focus:border-white transition-all"
                style={{ minHeight: '48px' }}
              >
                <option value="">Select Cuisine</option>
                {areas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            )}

            {filterType === 'diet' && (
              <select
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="w-full py-3 px-4 rounded-xl bg-white border-2 border-white/30 text-gray-900 font-bold shadow-lg focus:ring-2 focus:ring-white/50 focus:border-white transition-all"
                style={{ minHeight: '48px' }}
              >
                <option value="">Select Diet Plan</option>
                {diets.map((diet) => (
                  <option key={diet.name} value={diet.name}>
                    {diet.name}
                  </option>
                ))}
              </select>
            )}

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
