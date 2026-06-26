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
      className={`rounded-full border border-gray-300 px-4 py-2 font-pretendard text-[13px] font-black leading-[16px] text-subtext transition-colors ${
        isSelected ? 'bg-badge' : 'bg-elevated'
      }`}
    >
      {label}
    </button>
  )
}
