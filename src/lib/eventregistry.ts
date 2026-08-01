type RegistryItem = {
  title?: string;
  text?: string;
  summary?: string;
  url?: string;
  datetime?: string;
};

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

export const fetchEventRegistry = async (term: string): Promise<NormalizedArticle[]> => {
  try {
    const response = await fetch(
      `https://eventregistry-api.example.com/search?query=${encodeURIComponent(term)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.EVENTREGISTRY_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return (data.items as RegistryItem[]).map((item) => ({
      title: item.title || item.text || '',
      content: item.summary || item.text || '',
      source: {
        name: 'EventRegistry',
        url: item.url || '',
        logo: 'https://example.com/er-logo.png',
      },
      publishedAt: item.datetime || new Date().toISOString(),
      originalUrl: item.url || '',
    }));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('EventRegistry fetch error:', message);
    return [];
  }
};