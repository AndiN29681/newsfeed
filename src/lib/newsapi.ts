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

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: any = await response.json();

    if (data.status !== 'ok') {
      throw new Error(`NewsAPI error: ${data.status}`);
    }

    const articles: any[] = data.articles || [];

    return articles
      .filter((article: any) => article !== null && article !== undefined)
      .map((article: any) => ({
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
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('NewsAPI fetch error:', message);
    return [];
  }
};