import React from 'react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = '점포명 · 메뉴 검색',
}) => {
  return (
    <div className="flex w-full items-center gap-2.5 rounded-full border border-border-default bg-white px-5 py-3 shadow-[0_4px_10px_0_rgba(0,0,0,0.02)] focus-within:border-brand transition-all duration-200">
      <svg
        className="h-4.5 w-4.5 text-secondary shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm font-medium text-primary placeholder-secondary focus:outline-none font-pretendard"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="text-[#8b8b8b] hover:text-primary transition-colors p-0.5 shrink-0"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  )
}
