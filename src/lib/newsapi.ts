type NormalizedArticle = {
  title: string;
  content: string;
  source: {
    name: string;
    url: string;
    logo: string;
  };
  publishedAt: string;
  originalUrl: string;
};

export const fetchNewsAPI = async (term: string): Promise<NormalizedArticle[]> => {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(term)}&language=de&sortBy=publishedAt&pageSize=10&apiKey=${process.env.NEWSAPI_KEY}`,
      {
        next: { revalidate: 600 },
      }
    );

    // Check HTTP status before JSON parsing
    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status} - ${response.statusText}`);
    }

    try {
      // Parse JSON and validate structure
      const data = await response.json();

      // Validate API response structure
      if (data.status !== 'ok' || !data.articles || !Array.isArray(data.articles)) {
        throw new Error(`Invalid API Response: ${JSON.stringify(data)}`);
      }

      // Process articles
      const articles: any[] = data.articles || [];
      return articles
        .filter(article => article !== null && article !== undefined)
        .map(article => ({
          title: article.title || '',
          content: article.description || article.content || '',
          source: {
            name: article.source?.name || 'NewsAPI',
            url: article.url || '#',
            logo: article.urlToImage || article.url || 'https://via.placeholder.com/40',
          },
          publishedAt: article.publishedAt || new Date().toISOString(),
          originalUrl: article.url,
        }));
    } catch (parseError) {
      // Handle JSON parsing errors
      console.error('NewsAPI JSON Parsing Error:', parseError);
      return [];
    }

  } catch (error) {
    // Handle all other errors
    console.error('NewsAPI Fetch Error:', error.message);
    return [];
  }
};