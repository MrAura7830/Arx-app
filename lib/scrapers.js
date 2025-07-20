// Web scraping utilities for e-commerce sites
// Using ScraperAPI to handle anti-bot protection

const SCRAPER_API_KEY = process.env.SCRAPER_API_KEY;
const SCRAPER_BASE_URL = 'http://api.scraperapi.com';

// Helper function to make scraper requests
async function scrapeUrl(url, options = {}) {
  if (!SCRAPER_API_KEY) {
    console.warn('SCRAPER_API_KEY not found, using mock data');
    return null;
  }

  const params = new URLSearchParams({
    api_key: SCRAPER_API_KEY,
    url: url,
    render: options.render || 'false',
    country_code: options.country || 'us',
    ...options
  });

  try {
    const response = await fetch(`${SCRAPER_BASE_URL}?${params}`);
    if (!response.ok) {
      throw new Error(`Scraper API error: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error('Scraping error:', error);
    return null;
  }
}

// Amazon product search scraper
export async function scrapeAmazon(query) {
  const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(query)}`;
  const html = await scrapeUrl(searchUrl, { render: 'true' });
  
  if (!html) return [];

  // Parse Amazon search results
  // This is a simplified parser - in production you'd use a proper HTML parser
  const products = [];
  
  try {
    // Extract product data using regex patterns (simplified)
    const titleRegex = /<span class="a-size-medium a-color-base a-text-normal"[^>]*>([^<]+)<\/span>/g;
    const priceRegex = /<span class="a-price-whole">([^<]+)<\/span>/g;
    const linkRegex = /<a class="a-link-normal[^"]*" href="([^"]+)"/g;
    
    let titleMatch, priceMatch, linkMatch;
    let index = 0;
    
    while ((titleMatch = titleRegex.exec(html)) && index < 10) {
      priceMatch = priceRegex.exec(html);
      linkMatch = linkRegex.exec(html);
      
      if (titleMatch && priceMatch) {
        products.push({
          id: `amazon_${index}`,
          title: titleMatch[1].trim(),
          price: parseFloat(priceMatch[1].replace(/[,$]/g, '')),
          currency: 'USD',
          seller: 'Amazon',
          rating: 4.0 + Math.random(), // Simplified rating
          url: linkMatch ? `https://amazon.com${linkMatch[1]}` : searchUrl,
          bestDeal: false,
          badge: 'Prime Eligible'
        });
        index++;
      }
    }
  } catch (error) {
    console.error('Amazon parsing error:', error);
  }
  
  return products;
}

// eBay product search scraper
export async function scrapeEbay(query) {
  const searchUrl = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}`;
  const html = await scrapeUrl(searchUrl);
  
  if (!html) return [];

  const products = [];
  
  try {
    // Simplified eBay parser
    const titleRegex = /<h3 class="s-item__title"[^>]*>([^<]+)<\/h3>/g;
    const priceRegex = /<span class="s-item__price">.*?\$([0-9,]+\.?[0-9]*)/g;
    
    let titleMatch, priceMatch;
    let index = 0;
    
    while ((titleMatch = titleRegex.exec(html)) && index < 8) {
      priceMatch = priceRegex.exec(html);
      
      if (titleMatch && priceMatch) {
        products.push({
          id: `ebay_${index}`,
          title: titleMatch[1].trim(),
          price: parseFloat(priceMatch[1].replace(/[,$]/g, '')),
          currency: 'USD',
          seller: 'eBay',
          rating: 3.8 + Math.random(),
          url: `https://ebay.com/sch/i.html?_nkw=${encodeURIComponent(query)}`,
          bestDeal: false,
          badge: 'Auction'
        });
        index++;
      }
    }
  } catch (error) {
    console.error('eBay parsing error:', error);
  }
  
  return products;
}

// Walmart product search scraper
export async function scrapeWalmart(query) {
  const searchUrl = `https://www.walmart.com/search?q=${encodeURIComponent(query)}`;
  const html = await scrapeUrl(searchUrl, { render: 'true' });
  
  if (!html) return [];

  const products = [];
  
  try {
    // Simplified Walmart parser
    const titleRegex = /<span[^>]*data-automation-id="product-title"[^>]*>([^<]+)<\/span>/g;
    const priceRegex = /<div[^>]*data-automation-id="product-price"[^>]*>.*?\$([0-9,]+\.?[0-9]*)/g;
    
    let titleMatch, priceMatch;
    let index = 0;
    
    while ((titleMatch = titleRegex.exec(html)) && index < 6) {
      priceMatch = priceRegex.exec(html);
      
      if (titleMatch && priceMatch) {
        products.push({
          id: `walmart_${index}`,
          title: titleMatch[1].trim(),
          price: parseFloat(priceMatch[1].replace(/[,$]/g, '')),
          currency: 'USD',
          seller: 'Walmart',
          rating: 4.1 + Math.random() * 0.8,
          url: searchUrl,
          bestDeal: false,
          badge: 'Free Pickup'
        });
        index++;
      }
    }
  } catch (error) {
    console.error('Walmart parsing error:', error);
  }
  
  return products;
}
