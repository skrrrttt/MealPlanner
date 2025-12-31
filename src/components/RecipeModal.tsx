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
          <div className="w-full aspect-square bg-ios-gray-1">
            <img
              src={selectedMeal.strMealThumb}
              alt={selectedMeal.strMeal}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Meal Info */}
          <div className="p-4 space-y-4">
            {/* Tags */}
            <div className="flex gap-2 flex-wrap">
              <span className="px-3 py-1 bg-ios-blue/10 text-ios-blue text-sm font-medium rounded-full">
                {selectedMeal.strCategory}
              </span>
              <span className="px-3 py-1 bg-ios-gray-2 text-gray-700 text-sm font-medium rounded-full">
                {selectedMeal.strArea}
              </span>
            </div>

            {/* Ingredients */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Ingredients</h3>
              <div className="bg-ios-gray-1 rounded-ios p-4 space-y-2">
                {selectedMeal.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex justify-between items-center py-1">
                    <span className="text-gray-900 font-medium">{ingredient.name}</span>
                    <span className="text-gray-600 text-sm">{ingredient.measure}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">Instructions</h3>
              <div className="bg-ios-gray-1 rounded-ios p-4">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
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
