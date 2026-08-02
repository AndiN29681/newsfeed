export const fetchRssFeed = async (url: string): Promise<{ title: string, content: string, link: string }[]> => {
  try {
    // Use internal proxy to bypass CORS
    const proxyUrl = `/api/rss-proxy?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);

    if (!response.ok) {
      console.warn(`RSS-Fetch fehlgeschlagen: ${url} HTTP ${response.status}`);
      return [];
    }

    const xmlString = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');

    // Check for XML parse errors
    if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
      console.warn(`RSS-Fetch ungültige XML für ${url}`);
      return [];
    }

    const items = xmlDoc.getElementsByTagName('item');
    const results: { title: string, content: string, link: string }[] = [];

    for (let i = 0; i < items.length; i++) {
      const title = items[i].getElementsByTagName('title')[0]?.textContent || '';
      const link = items[i].getElementsByTagName('link')[0]?.textContent || items[i].getElementsByTagName('guid')[0]?.textContent || '';
      const description = items[i].getElementsByTagName('description')[0]?.textContent || items[i].getElementsByTagName('content:encoded')[0]?.textContent || '';

      const cleanTitle = title
        .replace(/<[^>]*>/g, '')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&gt;/g, '>')
        .replace(/&lt;/g, '<')
        .replace(/&amp;/g, '&')
        .trim();

      const cleanDesc = description
        .replace(/<[^>]*>/g, '')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&gt;/g, '>')
        .replace(/&lt;/g, '<')
        .replace(/&amp;/g, '&')
        .trim();

      results.push({ title: cleanTitle, content: cleanDesc, link });
    }

    console.log(`RSS-Fetch erfolgreich: ${url} - ${results.length} Artikel`);
    return results;
  } catch (error) {
    console.warn('RSS-Fetch fehlgeschlagen für', url, error);
    return [];
  }
};

export const searchRssFeeds = async (term: string, feeds: string[]) => {
  const lowerTerm = term.toLowerCase();
  const allResults = (await Promise.all(feeds.map(feed => fetchRssFeed(feed)).catch(() => []))).flat();

  return allResults.filter(item =>
    item.title.toLowerCase().includes(lowerTerm) ||
    item.content.toLowerCase().includes(lowerTerm)
  );
};

export const localMunichFeeds = [
  'https://www.tagesschau.de/xml/rss2/',
  'http://www.tagesschau.de/xml/rss2/index.html',
  'https://www.tagesschau.de/xml/rdf.rdf'
];

export const freisingErdingFeeds = [
  'https://www.tagesschau.de/xml/rdf.rdf',
  'https://www.tagesschau.de/xml/rss2/index.html'
];

export const goslarHarzFeeds = [
  'https://www.tagesschau.de/xml/rdf.rdf',
  'https://www.tagesschau.de/xml/rss2/index.html'
];

export const germanFeeds = [
  ...localMunichFeeds,
  ...freisingErdingFeeds,
  ...goslarHarzFeeds
];