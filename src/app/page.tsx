'use client'

import { useState, useEffect } from 'react'
import SearchBar from '@/components/SearchBar'
import ResultCard from '@/components/ResultCard'
import SummaryCard from '@/components/SummaryCard'
import { fetchEventRegistry } from '@/lib/eventregistry'
import { fetchNewsAPI } from '@/lib/newsapi'
import { fetchRssFeed, germanFeeds } from '@/lib/rss'
import { summarizeArticles } from '@/lib/summarize'

type BareArticle = {
  title: string
  content: string
  source: {
    name: string
    url: string
    logo: string
  }
}

type NewsItem = BareArticle & {
  originalUrl: string
}

export default function SearchPage() {
  const [query, setQuery] = useState<string>('')
  const [results, setResults] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState<string>('')
  const [hasMore, setHasMore] = useState<boolean>(false)

  const searchNews = async (searchTerm: string, page = 1) => {
    if (!searchTerm.trim()) return

    setLoading(true)
    setError(null)

    try {
      // Fetch from both sources in parallel
      const [erResults, newsResults] = await Promise.all([
        fetchEventRegistry(searchTerm),
        fetchNewsAPI(searchTerm)
      ])

      // Load RSS feeds
      const rssResults = (await Promise.all(germanFeeds.map(feed => fetchRssFeed(feed)))).flat();

      // Format RSS results to NewsItem
      const formattedRssResults = rssResults.map(item => ({
        title: item.title,
        content: item.content,
        source: {
          name: 'RSS-Feed',
          url: item.link,
          logo: 'https://via.placeholder.com/40',
        },
        publishedAt: new Date().toISOString(),
        originalUrl: item.link,
      }));

      // Combine and deduplicate results
      const allResults = [...erResults, ...newsResults, ...formattedRssResults];
      const uniqueResults = Array.from(
        new Map(allResults.map(item => [item.title, item])).values()
      ).slice(0, 10) as NewsItem[]

      setResults(uniqueResults)

      // Create clean versions for Claude summary
      const cleanArticles = uniqueResults.map(a => ({
        title: a.title,
        content: a.content,
        source: {
          name: a.source.name,
          url: a.source.url,
          logo: a.source.logo
        }
      }))

      // Generate summary if we have results
      if (uniqueResults.length > 0) {
        const summaryText = await summarizeArticles(cleanArticles, searchTerm)
        setSummary(summaryText || 'Zusammenfassung konnte nicht erstellt werden.')
      } else {
        setSummary('Keine Ergebnisse gefunden.')
      }
      setHasMore(uniqueResults.length >= 10)
    } catch (err) {
      console.error('Search error:', err)
      setError('Suche fehlgeschlagen. Bitte versuchen Sie es erneut.')
      setResults([])
      setSummary('')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchNews(query, 1)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Medienspiegel
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Geben Sie ein Schlagwort ein, um aktuelle News zu erhalten
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <form onSubmit={handleSearch} className="mb-8">
          <SearchBar
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Schlagwort eingeben (z.B. BMW, Klimawandel, KI)..."
            onSubmit={handleSearch}
          />
        </form>

        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>{error}</p>
          </div>
        )}

        {summary && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-6 mb-8 rounded-lg">
            <h2 className="text-xl font-semibold mb-2 text-blue-800 dark:text-blue-200">
              Zusammenfassung zu "{query}"
            </h2>
            <SummaryCard content={summary} />
          </div>
        )}

        {results.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Ergebnisse ({results.length})
            </h2>
            <div className="space-y-4">
              {results.map((result, index) => (
                <ResultCard
                  key={index}
                  {...result}
                  index={index + 1}
                />
              ))}
            </div>
          </>
        )}

        {results.length === 0 && !loading && !error && query && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Keine Ergebnisse für "{query}". Versuchen Sie es mit einem anderen Begriff.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}