'use client';

import { ShoppingCart, Trash2, Check, Apple, Fish, Milk, Wheat, Snowflake, Package, Sparkles, Droplet, Coffee } from 'lucide-react';
import { useMealStore } from '@/store/useMealStore';
import {
  getSortedCategories,
  getActiveItemCount,
  getCheckedItemCount,
} from '@/services/listHelper';

// Icon mapping for categories
const categoryIcons: Record<string, any> = {
  'Produce': Apple,
  'Meat & Seafood': Fish,
  'Dairy & Eggs': Milk,
  'Bakery & Bread': Wheat,
  'Frozen': Snowflake,
  'Pantry & Dry Goods': Package,
  'Spices & Seasonings': Sparkles,
  'Oils & Condiments': Droplet,
  'Beverages': Coffee,
};

export default function GroceryPage() {
  const { groceryList, toggleInPantry, toggleInCart, clearGroceryList } = useMealStore();

  const sortedCategories = getSortedCategories(groceryList);
  const activeCount = getActiveItemCount(groceryList);
  const checkedCount = getCheckedItemCount(groceryList);

  const handleClearList = () => {
    if (confirm('Are you sure you want to clear the grocery list?')) {
      clearGroceryList();
    }
  };

  return (
    <div className="h-full flex flex-col bg-ios-gray-1">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 safe-top shadow-lg">
        <div className="px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-extrabold text-white flex items-center gap-3 drop-shadow-lg mb-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <ShoppingCart size={32} strokeWidth={2.5} />
                </div>
                Grocery List
              </h1>
              {activeCount > 0 && (
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <p className="text-sm text-white/90 mb-2 font-semibold">
                    {checkedCount} of {activeCount} items collected
                  </p>
                  <div className="w-full h-3 bg-white/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 transition-all duration-500 shadow-lg"
                      style={{ width: `${(checkedCount / activeCount) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
            {sortedCategories.length > 0 && (
              <button
                onClick={handleClearList}
                className="ml-3 p-3 rounded-xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-all transform active:scale-95 shadow-lg"
                aria-label="Clear list"
              >
                <Trash2 size={24} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grocery List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {sortedCategories.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-8 text-center">
            <ShoppingCart size={64} className="text-ios-gray-4 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Grocery List</h2>
            <p className="text-gray-600">
              Generate a weekly meal plan to create your grocery list automatically
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {sortedCategories.map((category) => {
              const CategoryIcon = categoryIcons[category] || ShoppingCart;
              return (
                <div key={category} className="bg-white rounded-ios-lg shadow-ios overflow-hidden border border-ios-gray-2">
                  {/* Category Header */}
                  <div className="bg-gradient-to-r from-ios-blue/5 to-transparent px-4 py-3 border-b border-ios-gray-2">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                      <CategoryIcon size={18} className="text-ios-blue" />
                      {category}
                    </h3>
                  </div>

                {/* Items */}
                <div className="divide-y divide-ios-gray-2">
                  {groceryList[category]
                    .filter((item) => !item.inPantry)
                    .map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-4"
                        style={{ minHeight: '56px' }}
                      >
                        {/* Checkbox */}
                        <button
                          onClick={() => toggleInCart(category, item.name)}
                          className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ios-button-press"
                          style={{
                            borderColor: item.inCart ? '#007AFF' : '#C7C7CC',
                            backgroundColor: item.inCart ? '#007AFF' : 'transparent',
                          }}
                          aria-label={item.inCart ? 'Uncheck item' : 'Check item'}
                        >
                          {item.inCart && <Check size={16} className="text-white" strokeWidth={3} />}
                        </button>

                        {/* Item Info */}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`font-medium transition-all ${
                              item.inCart
                                ? 'line-through text-ios-gray-5'
                                : 'text-gray-900'
                            }`}
                          >
                            {item.name}
                          </p>
                          {item.measure && (
                            <p className="text-sm text-gray-600">{item.measure}</p>
                          )}
                        </div>

                        {/* In Pantry Button */}
                        <button
                          onClick={() => toggleInPantry(category, item.name)}
                          className="flex-shrink-0 px-3 py-1 text-xs font-medium text-ios-blue bg-ios-blue/10 rounded-full ios-button-press"
                          style={{ minHeight: '28px', minWidth: '70px' }}
                        >
                          In Pantry
                        </button>
                      </div>
                    ))}

                  {/* Show items in pantry (grayed out) */}
                  {groceryList[category].filter((item) => item.inPantry).length > 0 && (
                    <>
                      <div className="bg-ios-gray-1 px-4 py-2">
                        <p className="text-xs font-semibold text-ios-gray-5 uppercase tracking-wide">
                          In Pantry
                        </p>
                      </div>
                      {groceryList[category]
                        .filter((item) => item.inPantry)
                        .map((item, index) => (
                          <div
                            key={`pantry-${index}`}
                            className="flex items-center gap-3 p-4 bg-ios-gray-1/50"
                            style={{ minHeight: '56px' }}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-ios-gray-5 line-through">
                                {item.name}
                              </p>
                              {item.measure && (
                                <p className="text-sm text-ios-gray-5">{item.measure}</p>
                              )}
                            </div>
                            <button
                              onClick={() => toggleInPantry(category, item.name)}
                              className="flex-shrink-0 px-3 py-1 text-xs font-medium text-ios-gray-6 bg-ios-gray-2 rounded-full ios-button-press"
                              style={{ minHeight: '28px', minWidth: '70px' }}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                    </>
                  )}
                </div>
              </div>
              );
            })}

            {/* Bottom Padding */}
            <div className="h-4"></div>
          </div>
        )}
      </div>
    </div>
  );
}
