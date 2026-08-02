// RSS-Feed-Parser für deutsche Medien
export const fetchRssFeed = async (url: string): Promise<{ title: string, content: string, link: string }[]> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 Sekunden Timeout

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) return [];
    const xmlString = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');

    const items = xmlDoc.getElementsByTagName('item');
    const results: { title: string, content: string, link: string }[] = [];

    for (let i = 0; i < items.length; i++) {
      const title = items[i].getElementsByTagName('title')[0]?.textContent || '';
      const link = items[i].getElementsByTagName('link')[0]?.textContent || '';
      const description = items[i].getElementsByTagName('description')[0]?.textContent || '';
      results.push({ title, content: description, link });
    }

    return results;
  } catch (error) {
    console.warn('RSS-Fetch fehlgeschlagen für', url, error);
    return [];
  } finally {
    clearTimeout(timeoutId);
  }
};

export const localMunichFeeds = [
  'https://www.tz.de/rss/muenchen/',
  'https://www.abendzeitung-muenchen.de/rss/',
  'https://www.sueddeutsche.de/rss/muenchen',
  'https://www.muenchen.de/rss/muenchen/',
  'https://www.br24.de/rss/muenchen',
  'https://www.br.de/br1/rss.xml',
  'https://www.muenchner-merkur.de/rss/',
  'https://www.muenchner-stadtanzeiger.de/rss/'
];

export const freisingErdingFeeds = [
  'https://www.br24.de/rss/freising',
  'https://www.br24.de/rss/erding',
  'https://www.landkreis-freising.de/rss.xml',
  'https://www.landkreis-erding.de/rss.xml',
  'https://www.hallbergmoos.de/rss.xml',
  'https://www.freising.de/rss.xml'
];

export const goslarHarzFeeds = [
  'https://www.tz.de/rss/goslar/',
  'https://www.br24.de/rss/goslar',
  'https://www.sueddeutsche.de/rss/goslar',
  'https://www.goslar.de/rss.xml',
  'https://www.harz.de/rss.xml',
  'https://www.tz.de/rss/harz/',
  'https://www.br.de/hr3/rss/'
];

export const germanFeeds = [
  ...localMunichFeeds,
  ...freisingErdingFeeds,
  ...goslarHarzFeeds
];