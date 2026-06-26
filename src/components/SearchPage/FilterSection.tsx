import { FilterChip } from './FilterChip'

interface FilterSectionProps {
  title: string
  options: string[]
  selected: string[]
  onToggle: (option: string) => void
}

export const FilterSection = ({
  title,
  options,
  selected,
  onToggle,
}: FilterSectionProps) => {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-section-heading font-semibold">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <FilterChip
            key={option}
            label={option}
            isSelected={selected.includes(option)}
            onClick={() => onToggle(option)}
          />
        ))}
      </div>
    </div>
  )
}
