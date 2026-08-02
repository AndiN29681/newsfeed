import { Search, X } from 'lucide-react'
import { useState, useEffect } from 'react'

interface SearchBarProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
  placeholder?: string
}

export default function SearchBar({ value, onChange, onSubmit, placeholder = 'Schlagwort eingeben...' }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className={`
          relative flex items-center transition-all duration-200
          ${isFocused ? 'scale-[1.02] shadow-lg' : ''}
        `}>
          <input
            type="text"
            value={value}
            onChange={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="w-full px-5 py-4 pl-12 pr-12 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-lg font-medium"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange({ target: { value: '' } } as any)
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            </button>
          )}
        </div>
    </div>
  )
}