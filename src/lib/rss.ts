export const fetchRssFeed = async (url: string): Promise<{ title: string, content: string, link: string }[]> => {
  try {
    const proxyUrl = `/api/rss-proxy?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);

    if (!response.ok) {
      console.warn(`RSS-Fetch fehlgeschlagen: ${url} HTTP ${response.status}`);
      return [];
    }

    const xmlString = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');

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

// München
export const localMunichFeeds = [
  'https://www.tagesschau.de/xml/rss2/',
  'https://www.tagesschau.de/infoservices/alle-meldungen-100~rss2.xml',
  'https://www.deutschlandfunk.de/nachrichten-100.rss',
  'https://www.abendzeitung-muenchen.de/rss/',
  'https://www.merkur.de/feed',
  'https://www.br24.de/rss/muenchen',
  'https://www.tag24.com/muenchen/rss/',
  'https://www.muenchen.de/rss/'
];

// Freising, Hallbergmoos, Erding
export const freisingErdingFeeds = [
  'https://www.freising.de/rss.xml',
  'https://www.hallbergmoos.de/rss.xml',
  'https://www.landkreis-erding.de/rss.xml',
  'https://www.br24.de/rss/freising',
  'https://www.br24.de/rss/erding',
  'https://www.freisinger-ticker.de/feed/'
];

// Goslar, Harz, Clausthal-Zellerfeld
export const goslarHarzFeeds = [
  'https://www.goslar.de/rss.xml',
  'https://www.harz-heute.de/feed/',
  'https://www.hoehenreise.de/feed/',
  'https://www.clausthal-zeitung.de/feed/',
  'https://www.br24.de/rss/harz',
  'https://www.welt.de/regional/harz/',
  'https://www.tagesschau.de/infoservices/harz-100~rss2.xml'
];

// Auto
export const automotiveFeeds = [
  'https://www.auto-bild.de/rss',
  'https://www.motortalk.de/forum/feed',
  'https://auto-journal.net/feed',
  'https://www.autohaus.de/rss/'
];

// Mountainbike / Gravelbike
export const cyclingFeeds = [
  'https://www.mtb-news.com/rss',
  'https://www.gravel-ride.com/feed',
  'https://www.bikeradar.com/feed/rss/news',
  'https://www.road.cc/feed/rss'
];

// Harz
export const harzFeeds = [
  'https://www.harz-heute.de/feed/',
  'https://www.hoehenreise.de/feed/',
  'https://www.ale-welt.de/feed/'
];

// Clausthal-Zellerfeld
export const clausthalFeeds = [
  'https://www.clausthal-zeitung.de/feed/',
  'https://www.altenstadt-zeitung.de/feed/'
];

// KI
export const kiFeeds = [
  'https://www.heise.de/ai/feed/',
  'https://www.ia-hub.org/feed/',
  'https://www.t3n.de/news/ki/feed/'
];

// Alle deutschen Feeds kombiniert
export const germanFeeds = [
  ...localMunichFeeds,
  ...freisingErdingFeeds,
  ...goslarHarzFeeds,
  ...automotiveFeeds,
  ...cyclingFeeds,
  ...harzFeeds,
  ...clausthalFeeds,
  ...kiFeeds
];