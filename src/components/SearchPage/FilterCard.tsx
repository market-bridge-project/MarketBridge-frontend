import { FilterSection } from './FilterSection'

const COMPANION_OPTIONS = ['혼자', '친구랑', '연인과', '가족과']
const PURPOSE_OPTIONS = ['식사', '간식', '장보기', '구경']
const DURATION_OPTIONS = ['짧게', '중간', '길게']

interface FilterCardProps {
  companion: string[]
  purpose: string[]
  duration: string[]
  onToggleCompanion: (value: string) => void
  onTogglePurpose: (value: string) => void
  onToggleDuration: (value: string) => void
}

export const FilterCard = ({
  companion,
  purpose,
  duration,
  onToggleCompanion,
  onTogglePurpose,
  onToggleDuration,
}: FilterCardProps) => {
  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-[#FFFFFFB2] p-6">
      <FilterSection
        title="누구와"
        options={COMPANION_OPTIONS}
        selected={companion}
        onToggle={onToggleCompanion}
      />
      <FilterSection
        title="무엇을"
        options={PURPOSE_OPTIONS}
        selected={purpose}
        onToggle={onTogglePurpose}
      />
      <FilterSection
        title="얼마나"
        options={DURATION_OPTIONS}
        selected={duration}
        onToggle={onToggleDuration}
      />
    </div>
  )
}
