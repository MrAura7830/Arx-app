# App Blueprint: BargainFinder AI  

## 1. Project Breakdown  

**App Name:** BargainFinder AI  

**Platform:** Web  

**Summary:** BargainFinder AI is a web application that leverages AI to help users find the best deals for any item online. Users input an item name and description, and the AI scours the web to find trustworthy sellers offering the item at competitive prices. The app displays a list of results with direct purchase links, prices, and seller credibility ratings.  

**Primary Use Case:**  
- Users searching for specific products at the best prices  
- Shoppers comparing multiple sellers before purchasing  
- Individuals looking for trustworthy online retailers  

**Authentication Requirements:**  
- Optional account creation (via Supabase Auth) to save search history  
- Guest users can perform searches without signing up  

---  

## 2. Tech Stack Overview  

**Frontend Framework:** React + Next.js (App Router)  
**UI Library:** Tailwind CSS + ShadCN (for pre-built, accessible components)  
**Backend (BaaS):** Supabase (PostgreSQL for data storage, Auth for user management)  
**Deployment:** Vercel (optimized for Next.js)  

---  

## 3. Core Features  

1. **AI-Powered Search:**  
   - Users enter an item name + description  
   - AI fetches results from trusted e-commerce sites (e.g., Amazon, eBay, Walmart)  
   - Results include price, seller rating, and direct purchase link  

2. **Price Comparison Dashboard:**  
   - Displays multiple sellers side-by-side  
   - Highlights the best deal based on price + seller reputation  

3. **User Favorites & Search History (if logged in):**  
   - Saved searches for quick rechecking  
   - Bookmarked items for later purchase  

4. **Seller Trust Scoring:**  
   - AI evaluates seller ratings/reviews  
   - Badges for "Top Rated" or "Best Value"  

5. **Direct Purchase Links:**  
   - One-click redirects to the product page  

---  

## 4. User Flow  

1. **Landing Page:**  
   - Clean search bar + example queries  
   - Optional "Sign Up" prompt (non-blocking)  

2. **Search Execution:**  
   - User enters query → AI fetches results in real-time  
   - Loading skeleton UI while processing  

3. **Results Page:**  
   - Grid/list of items with:  
     - Image thumbnail  
     - Price (highlighted if best deal)  
     - Seller name + trust badge  
     - "Visit Store" button (external link)  

4. **Optional Actions:**  
   - Logged-in users can save items  
   - Filter/sort by price, rating, or delivery time  

5. **Purchase:**  
   - External link opens the seller’s page in a new tab  

---  

## 5. Design & UI/UX Guidelines  

- **Color Scheme:**  
  - Primary: Blue (#3B82F6, trustworthy)  
  - Secondary: Green (#10B981, for best deals)  
  - Neutral: Slate (#64748B) for text  

- **Typography:**  
  - Headings: Inter (Bold, 20px+)  
  - Body: Inter (Regular, 16px)  

- **Key UI Components (ShadCN):**  
  - `<Card>` for product listings  
  - `<Badge>` for trust indicators  
  - `<Skeleton>` for loading states  
  - `<Button>` with shopping cart icon for CTAs  

- **Mobile-First:**  
  - Single-column layout on mobile → 2-column grid on desktop  

---  

## 6. Technical Implementation  

**Frontend (Next.js):**  
- `/app/search/page.tsx`: Search input + results hydration  
- `/app/item/[id]/page.tsx`: Detailed item view (if needed)  
- `lib/ai-search.ts`: API calls to AI web-scraping service (e.g., custom scraper or third-party API)  

**Backend (Supabase):**  
- `products` table: Cached search results (item_name, price, seller_url, rating)  
- `user_searches` table: Saved searches (user_id, query, timestamp)  
- Row-Level Security (RLS): Enabled for user-specific data  

**AI Integration:**  
- Use a lightweight model (e.g., OpenAI GPT-4-turbo) for query interpretation  
- Web scraping via proxy APIs (e.g., ScraperAPI) to avoid blocks  

**Deployment (Vercel):**  
- Next.js middleware for auth redirects  
- Edge Functions for fast AI responses  

---  

## 7. Development Tools & Setup  

1. **Local Setup:**  
   ```bash
   npx create-next-app@latest bargain-finder --tailwind
   cd bargain-finder
   npm install @supabase/supabase-js @radix-ui/react-dropdown-menu shadcn-ui
   npx shadcn-ui@latest init
   ```  

2. **Supabase Config:**  
   - Create a new project at supabase.com  
   - Enable Auth + PostgreSQL database  
   - Add tables with `uuid` primary keys  

3. **Environment Variables:**  
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
   OPENAI_API_KEY=your-key (if using GPT)
   ```  

4. **Vercel Deployment:**  
   - Connect GitHub repo → automatic deployments on `main` branch  
   - Add env vars in Vercel dashboard  

---  

**Strict Adherence to Tech Stack:**  
- No alternate databases (e.g., Firebase) or UI libraries (e.g., MUI)  
- Supabase handles all backend needs (Auth, Storage, DB)  
- Vercel ensures zero-config Next.js optimizations