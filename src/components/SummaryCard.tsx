export default function SummaryCard({ content }: { content: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-md">
      <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
        {content}
      </p>
    </div>
  )
}