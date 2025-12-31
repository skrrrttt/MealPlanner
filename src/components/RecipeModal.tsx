'use client';

import { X } from 'lucide-react';
import { Meal } from '@/services/api';
import { useMealStore } from '@/store/useMealStore';

export function RecipeModal() {
  const { selectedMeal, setSelectedMeal } = useMealStore();

  if (!selectedMeal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 fade-in">
      <div
        className="w-full max-w-2xl bg-white rounded-t-ios-lg max-h-[90vh] overflow-hidden slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-ios-gray-2 z-10">
          <div className="flex items-center justify-between p-4 safe-top">
            <h2 className="text-xl font-bold text-gray-900 flex-1 pr-4">
              {selectedMeal.strMeal}
            </h2>
            <button
              onClick={() => setSelectedMeal(null)}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-ios-gray-2 ios-button-press"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(90vh - 72px)' }}>
          {/* Image */}
          <div className="w-full aspect-video bg-gradient-to-br from-ios-blue/5 to-ios-gray-1">
            <img
              src={selectedMeal.strMealThumb}
              alt={selectedMeal.strMeal}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Meal Info */}
          <div className="p-4 space-y-5">
            {/* Tags */}
            <div className="flex gap-2 flex-wrap">
              <span className="px-3 py-1.5 bg-gradient-to-r from-ios-blue to-ios-blue/90 text-white text-sm font-semibold rounded-full shadow-sm">
                {selectedMeal.strCategory}
              </span>
              <span className="px-3 py-1.5 bg-white border border-ios-gray-3 text-gray-700 text-sm font-medium rounded-full">
                {selectedMeal.strArea}
              </span>
            </div>

            {/* Ingredients */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-ios-blue rounded-full"></span>
                Ingredients
              </h3>
              <div className="bg-white border border-ios-gray-2 rounded-ios divide-y divide-ios-gray-2 overflow-hidden">
                {selectedMeal.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex justify-between items-center px-4 py-3">
                    <span className="text-gray-900 font-medium">{ingredient.name}</span>
                    <span className="text-ios-blue text-sm font-medium">{ingredient.measure}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-ios-blue rounded-full"></span>
                Instructions
              </h3>
              <div className="bg-white border border-ios-gray-2 rounded-ios p-4">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed text-[15px]">
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
