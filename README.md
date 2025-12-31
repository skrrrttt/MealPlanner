# Smart Meal Planner & Grocery List PWA

A mobile-optimized Progressive Web App for generating weekly meal plans and smart grocery lists, built with Next.js and optimized for iPhone.

## Features

- **Weekly Meal Planning**: Generate 7-day meal plans with customizable filters
- **Smart Grocery List**: Automatically aggregated ingredients sorted by store aisle
- **Offline Support**: PWA capabilities for Add to Home Screen on iOS
- **Mobile-First Design**: iOS-style interface with safe area support
- **Filter Options**:
  - Random meals
  - By Category (Seafood, Vegetarian, etc.)
  - By Cuisine (Italian, Mexican, etc.)
- **Interactive Shopping**:
  - Check items off as you shop
  - Mark items already in pantry
  - Smart ingredient aggregation

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: Zustand with localStorage persistence
- **Data Source**: TheMealDB API
- **Hosting**: Cloudflare Pages (Static Export)

## Project Structure

```
MealPlanner/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with PWA meta
│   │   ├── page.tsx             # Home page (meal planner)
│   │   ├── grocery/
│   │   │   └── page.tsx         # Grocery list page
│   │   └── globals.css          # Global styles & iOS utilities
│   ├── components/
│   │   ├── BottomNav.tsx        # Bottom navigation bar
│   │   └── RecipeModal.tsx      # Recipe detail modal
│   ├── services/
│   │   ├── api.ts               # TheMealDB API integration
│   │   └── listHelper.ts        # Grocery categorization logic
│   └── store/
│       └── useMealStore.ts      # Zustand state management
├── public/
│   ├── manifest.json            # PWA manifest
│   ├── icon-192.png            # App icon 192x192
│   └── icon-512.png            # App icon 512x512
├── next.config.mjs              # Next.js configuration (static export)
├── tailwind.config.ts           # Tailwind with iOS theme
└── tsconfig.json                # TypeScript configuration
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
```

This creates a static export in the `out/` directory, ready for Cloudflare Pages.

## PWA Setup for iOS

1. **Add App Icons**: Replace placeholder icons in `/public/`:
   - `icon-192.png` (192x192 pixels)
   - `icon-512.png` (512x512 pixels)

2. **Install on iPhone**:
   - Open the app in Safari
   - Tap the Share button
   - Select "Add to Home Screen"
   - The app will install with the icon and theme color

## Key Components

### TheMealDB API Service (`src/services/api.ts`)

- Fetches categories and cuisines
- Generates weekly meal plans with filters
- Retrieves detailed recipe information

### Grocery List Helper (`src/services/listHelper.ts`)

- Categorizes ingredients by store aisle using keyword matching
- Aggregates duplicate ingredients
- Sorts items by typical grocery store layout

### Zustand Store (`src/store/useMealStore.ts`)

- Manages weekly meal plan state
- Handles grocery list with check-off functionality
- Persists data to localStorage

## Deployment to Cloudflare Pages

1. Connect your GitHub repository to Cloudflare Pages
2. Configure build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
3. Deploy

The app is configured for static export and client-side routing.

## Mobile Optimization

- All touch targets are 44px+ for comfortable tapping
- Safe area insets for iPhone notch and home indicator
- iOS-style animations and transitions
- Optimized for portrait orientation
- Responsive up to tablet sizes (max-width: 768px)

## Grocery List Intelligence

The app categorizes ingredients into these aisles:

- Produce
- Meat & Seafood
- Dairy & Eggs
- Bakery & Bread
- Frozen
- Pantry & Dry Goods
- Spices & Seasonings
- Oils & Condiments
- Beverages
- Other

Ingredients are automatically sorted in typical shopping order.

## Browser Support

- iOS Safari 14+
- Chrome/Edge (mobile and desktop)
- Firefox (mobile and desktop)

## License

MIT

## Credits

- Recipe data provided by [TheMealDB](https://www.themealdb.com/)
