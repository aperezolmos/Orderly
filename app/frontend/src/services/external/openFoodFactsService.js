const BASE_URL = 'https://world.openfoodfacts.org/cgi/search.pl';

const USER_AGENT = 'TFG-Restauracion/0.8.0-beta (apo1004@alu.ubu.es)';


export const openFoodFactsService = {
  
  searchProducts: async (query, page = 1, pageSize = 15) => {
    
    const params = new URLSearchParams({
      search_terms: query || '',
      search_simple: '1',
      json: '1',
      page: page.toString(),
      page_size: pageSize.toString(),
      fields: 'code,product_name,image_url,brands',
    });
    const url = `${BASE_URL}?${params.toString()}`;

    //console.log('URL petición: ', url); 
    
    const res = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
      },
    });
    
    if (!res.ok) {
      throw new Error(`Open Food Facts error: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  },
};
