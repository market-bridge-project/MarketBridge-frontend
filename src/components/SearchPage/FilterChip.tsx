interface FilterChipProps {
  label: string
  isSelected: boolean
  onClick: () => void
}

export const FilterChip = ({ label, isSelected, onClick }: FilterChipProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={`rounded-full border border-gray-300 px-4 py-2 font-pretendard text-[13px] font-black leading-[16px] transition-colors ${
        isSelected ? 'bg-badge text-brand' : 'bg-elevated text-subtext'
      }`}
    >
      {label}
    </button>
  )
}
