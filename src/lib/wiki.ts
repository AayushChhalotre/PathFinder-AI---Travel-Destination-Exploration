export interface WikiDetails {
  title: string;
  extract: string;
  thumbnailUrl: string | null;
}

export async function fetchDestinationDetails(name: string): Promise<WikiDetails | null> {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages|extracts&exintro&titles=${encodeURIComponent(name)}&format=json&pithumbsize=1200&origin=*`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.query && data.query.pages) {
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];
      if (pageId === '-1') return null; // Not found
      
      const page = pages[pageId];
      
      // Clean up the extract (strip HTML)
      const extractRaw = page.extract || '';
      const extractClean = extractRaw.replace(/<[^>]*>?/gm, '');
      
      return {
        title: page.title,
        extract: extractClean,
        thumbnailUrl: page.thumbnail?.source || null
      };
    }
  } catch (error) {
    console.error('Failed to fetch wiki details:', error);
  }
  return null;
}
