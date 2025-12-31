'use client';

import { X, Clock, ChefHat } from 'lucide-react';
import { Meal } from '@/services/api';
import { useMealStore } from '@/store/useMealStore';

export function RecipeModal() {
  const { selectedMeal, setSelectedMeal } = useMealStore();

  if (!selectedMeal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm fade-in"
      onClick={() => setSelectedMeal(null)}
    >
      <div
        className="w-full max-w-2xl bg-gradient-to-b from-white to-ios-gray-1/30 rounded-t-[30px] max-h-[90vh] overflow-hidden slide-up shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-ios-gray-3 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-ios-gray-2 z-10">
          <div className="flex items-center justify-between p-4">
            <div className="flex-1 pr-4">
              <h2 className="text-xl font-bold text-gray-900 leading-tight">
                {selectedMeal.strMeal}
              </h2>
            </div>
            <button
              onClick={() => setSelectedMeal(null)}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-ios-gray-2 hover:bg-ios-gray-3 transition-colors ios-button-press"
              aria-label="Close"
            >
              <X size={22} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(90vh - 80px)' }}>
          {/* Image */}
          <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
            <img
              src={selectedMeal.strMealThumb}
              alt={selectedMeal.strMeal}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </div>

          {/* Meal Info */}
          <div className="p-5 space-y-6">
            {/* Tags */}
            <div className="flex gap-2 flex-wrap items-center -mt-2">
              <span className="px-4 py-2 bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 text-white text-sm font-bold rounded-full shadow-lg">
                {selectedMeal.strCategory}
              </span>
              <span className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-sm font-bold rounded-full shadow-lg">
                {selectedMeal.strArea}
              </span>
              <span className="px-3 py-2 bg-white border-2 border-ios-gray-3 text-gray-600 text-xs font-semibold rounded-full flex items-center gap-1.5">
                <ChefHat size={14} />
                Recipe
              </span>
            </div>

            {/* Ingredients */}
            <div>
              <h3 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-7 bg-gradient-to-b from-orange-500 to-pink-500 rounded-full shadow-md"></span>
                Ingredients
              </h3>
              <div className="bg-gradient-to-br from-white via-orange-50/30 to-amber-50/30 border-2 border-orange-200 rounded-2xl divide-y divide-orange-100 overflow-hidden shadow-lg">
                {selectedMeal.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex justify-between items-center px-5 py-4 hover:bg-orange-50/50 transition-colors">
                    <span className="text-gray-900 font-semibold">{ingredient.name}</span>
                    <span className="text-orange-600 text-sm font-bold bg-orange-100 px-3 py-1 rounded-full">
                      {ingredient.measure}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div>
              <h3 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 mb-4 flex items-center gap-2">
                <span className="w-1.5 h-7 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full shadow-md"></span>
                Instructions
              </h3>
              <div className="bg-gradient-to-br from-white via-blue-50/30 to-cyan-50/30 border-2 border-blue-200 rounded-2xl p-6 shadow-lg">
                <p className="text-gray-800 whitespace-pre-line leading-relaxed text-[15px] font-medium">
                  {selectedMeal.strInstructions}
                </p>
              </div>
            </div>

            {/* Bottom Padding */}
            <div className="h-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
