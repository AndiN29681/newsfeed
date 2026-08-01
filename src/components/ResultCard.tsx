import Link from 'next/link'
import Image from 'next/image'

interface ResultCardProps {
  title: string
  content: string
  source: {
    name: string
    url: string
    logo: string
  }
  originalUrl: string
  index: number
}

export default function ResultCard({
  title,
  content,
  source,
  originalUrl,
  index
}: ResultCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-4 relative">
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 h-10 w-10 rounded-full bg-yellow-100 dark:bg-gray-700 flex items-center justify-center mb-2"
      >
        <Image
          src={source.logo}
          alt={`${source.name} Logo`}
          width={40}
          height={40}
          className="object-contain"
          priority
        />
      </a>
      <div className="flex-grow pl-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {title || 'Kein Titel'}
        </h2>

        <p className="text-gray-700 dark:text-gray-300 mb-3 line-clamp-3">
          {content || 'Keine Beschreibung verfügbar'}
        </p>

        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <span>Quelle: <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline"
          >
            {source.name}
          </a></span>
          <span>
            <a
              href={originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline"
            >
              Originalartikel
            </a>
          </span>
        </div>
      </div>
    </div>
  )
}