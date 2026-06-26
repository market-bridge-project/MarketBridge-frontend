import React from 'react'
import { motion } from 'framer-motion'

interface CategoryChipProps {
  label: string
  isSelected: boolean
  onClick: () => void
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  label,
  isSelected,
  onClick,
}) => {
  return (
    <motion.button
      layout
      transition={{
        type: 'tween',
        ease: 'easeInOut',
        duration: 0.25,
      }}
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full border px-5 py-2.5 text-[14px] font-semibold font-pretendard transition-colors duration-200 ${
        isSelected
          ? 'bg-brand text-white border-brand shadow-[0_4px_12px_rgba(21,95,58,0.2)]'
          : 'bg-white text-primary border-border-default hover:bg-glow hover:border-[#ece9e0]/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)]'
      }`}
    >
      {label}
    </motion.button>
  )
}
