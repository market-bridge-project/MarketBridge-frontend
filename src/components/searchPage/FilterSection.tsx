import type { KeywordOption } from '../../types/keyword'
import { FilterChip } from './FilterChip'

interface FilterSectionProps {
  title: string
  options: KeywordOption[]
  selected: string[]
  onToggle: (label: string) => void
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
            key={option.name}
            label={option.label}
            isSelected={selected.includes(option.label)}
            onClick={() => onToggle(option.label)}
          />
        ))}
      </div>
    </div>
  )
}
