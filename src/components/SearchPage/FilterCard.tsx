import type { KeywordOption } from '../../types/keyword'
import { FilterSection } from './FilterSection'

interface FilterCardProps {
  companion: string[]
  purpose: string[]
  duration: string[]
  companionOptions: KeywordOption[]
  purposeOptions: KeywordOption[]
  durationOptions: KeywordOption[]
  onToggleCompanion: (value: string) => void
  onTogglePurpose: (value: string) => void
  onToggleDuration: (value: string) => void
}

export const FilterCard = ({
  companion,
  purpose,
  duration,
  companionOptions,
  purposeOptions,
  durationOptions,
  onToggleCompanion,
  onTogglePurpose,
  onToggleDuration,
}: FilterCardProps) => {
  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-[#FFFFFFB2] p-6 shadow-[0_8px_22px_0_rgba(43,27,14,0.05)]">
      <FilterSection
        title="누구와"
        options={companionOptions}
        selected={companion}
        onToggle={onToggleCompanion}
      />
      <FilterSection
        title="무엇을"
        options={purposeOptions}
        selected={purpose}
        onToggle={onTogglePurpose}
      />
      <FilterSection
        title="얼마나"
        options={durationOptions}
        selected={duration}
        onToggle={onToggleDuration}
      />
    </div>
  )
}
