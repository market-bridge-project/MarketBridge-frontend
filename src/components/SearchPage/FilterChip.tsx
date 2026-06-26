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
      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        isSelected ? 'bg-brand text-white' : 'bg-elevated text-black'
      }`}
    >
      {label}
    </button>
  )
}
