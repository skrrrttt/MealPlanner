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
  const [filterType, setFilterType] = useState<'none' | 'category' | 'area'>('none');
  const [filterValue, setFilterValue] = useState('');

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
      const meals = await generateWeeklyPlan(filterType, filterValue);
      setWeeklyPlan(meals);
    } catch (error) {
      console.error('Failed to generate plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterTypeChange = (type: 'none' | 'category' | 'area') => {
    setFilterType(type);
    setFilterValue('');
  };

  return (
    <>
      <div className="h-full flex flex-col bg-ios-gray-1">
        {/* Header */}
        <div className="bg-white border-b border-ios-gray-2 safe-top">
          <div className="px-4 py-4">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ChefHat className="text-ios-blue" size={28} />
              Meal Planner
            </h1>
          </div>

          {/* Filters */}
          <div className="px-4 pb-4 space-y-3">
            {/* Filter Type */}
            <div className="flex gap-2">
              <button
                onClick={() => handleFilterTypeChange('none')}
                className={`flex-1 py-2 px-4 rounded-ios font-medium text-sm transition-all ios-button-press ${
                  filterType === 'none'
                    ? 'bg-ios-blue text-white'
                    : 'bg-ios-gray-2 text-gray-700'
                }`}
              >
                Random
              </button>
              <button
                onClick={() => handleFilterTypeChange('category')}
                className={`flex-1 py-2 px-4 rounded-ios font-medium text-sm transition-all ios-button-press ${
                  filterType === 'category'
                    ? 'bg-ios-blue text-white'
                    : 'bg-ios-gray-2 text-gray-700'
                }`}
              >
                Category
              </button>
              <button
                onClick={() => handleFilterTypeChange('area')}
                className={`flex-1 py-2 px-4 rounded-ios font-medium text-sm transition-all ios-button-press ${
                  filterType === 'area'
                    ? 'bg-ios-blue text-white'
                    : 'bg-ios-gray-2 text-gray-700'
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
                className="w-full py-3 px-4 rounded-ios bg-white border border-ios-gray-3 text-gray-900 font-medium"
                style={{ minHeight: '44px' }}
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
                className="w-full py-3 px-4 rounded-ios bg-white border border-ios-gray-3 text-gray-900 font-medium"
                style={{ minHeight: '44px' }}
              >
                <option value="">Select Cuisine</option>
                {areas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGeneratePlan}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-ios-blue text-white font-semibold rounded-ios shadow-ios flex items-center justify-center gap-2 transition-all ios-button-press disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ minHeight: '44px' }}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={20} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw size={20} />
                  Generate Weekly Plan
                </>
              )}
            </button>
          </div>
        </div>

        {/* Weekly Plan */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
          {weeklyPlan.map((dayPlan) => (
            <div
              key={dayPlan.day}
              className="bg-white rounded-ios shadow-ios overflow-hidden"
            >
              {dayPlan.meal ? (
                <button
                  onClick={() => setSelectedMeal(dayPlan.meal)}
                  className="w-full text-left ios-button-press"
                >
                  <div className="flex gap-3 p-3">
                    <div className="w-20 h-20 flex-shrink-0 rounded-ios overflow-hidden bg-ios-gray-1">
                      <img
                        src={dayPlan.meal.strMealThumb}
                        alt={dayPlan.meal.strMeal}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-ios-blue uppercase tracking-wide mb-1">
                        {dayPlan.day}
                      </div>
                      <h3 className="text-base font-bold text-gray-900 line-clamp-2 mb-1">
                        {dayPlan.meal.strMeal}
                      </h3>
                      <div className="flex gap-2 text-xs text-gray-600">
                        <span>{dayPlan.meal.strCategory}</span>
                        <span>•</span>
                        <span>{dayPlan.meal.strArea}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ) : (
                <div className="p-4">
                  <div className="text-xs font-semibold text-ios-gray-5 uppercase tracking-wide mb-2">
                    {dayPlan.day}
                  </div>
                  <p className="text-sm text-ios-gray-5 italic">No meal planned</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <RecipeModal />
    </>
  );
}
