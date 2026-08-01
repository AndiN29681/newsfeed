import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

type Article = {
  title: string;
  content: string;
  source: {
    name: string;
    url: string;
    logo?: string;
  };
};

export const summarizeArticles = async (articles: Article[], term: string): Promise<string | null> => {
  try {
    const articleTexts = articles
      .map(
        (a, i) =>
          `[Quelle ${i + 1}: ${a.source.name}] ${a.title}\n${a.content}`
      )
      .join('\n\n---\n\n');

    const prompt = `Fasse die folgenden Nachrichten-Artikel zum Schlagwort "${term}" in 2–4 Sätzen zusammen. Nenne für jeden wesentlichen Punkt die Quelle (Nummer) im Format [Quelle N]. Behalte die Quellenangaben bei.\n\nArtikel:\n${articleTexts}`;

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    });

    let result = '';
    for (const block of message.content) {
      if (block.type === 'text') {
        result += block.text;
        break;
      }
    }
    return result || null;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error';
    console.error('Summarize error:', message);
    return null;
  }
};