import type { Store } from '@/types/store'
import goToDetailIcon from '@/assets/icons/go_to_detail.svg'

interface StorePreviewSheetProps {
  store: Store | null
  onClose: () => void
  onDetail: (storeId: string) => void
}

export const StorePreviewSheet = ({
  store,
  onClose,
  onDetail,
}: StorePreviewSheetProps) => {
  if (!store) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end" onClick={onClose}>
      <div
        className="relative mx-auto flex w-full max-w-[430px] max-h-[85vh] overflow-y-auto flex-col gap-[18px] rounded-[28px] bg-app px-6 pt-7 pb-[11px] shadow-[0_14px_30px_0_rgba(43,27,14,0.08)]"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={goToDetailIcon}
          alt=""
          className="absolute top-4 left-1/2 h-[5px] w-[60px] -translate-x-1/2"
        />
        <div className="overflow-hidden rounded-2xl">
          {store.imageUrl ? (
            <img
              src={store.imageUrl}
              alt={store.name}
              className="aspect-[16/10] w-full object-cover"
            />
          ) : (
            <div className="aspect-[16/10] w-full bg-gray-200" />
          )}
        </div>

        <h2 className="text-[28px] font-bold leading-[34px] text-primary">{store.name}</h2>

        <div className="flex flex-wrap gap-2">
          {store.tags.map((tag, i) => (
            <span
              key={i}
              className={`rounded-full border border-border-default px-3 py-1 text-[13px] font-semibold leading-[16px] ${
                i === 0 ? 'text-brand' : 'text-secondary'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

        <div>
          <h3 className="font-pretendard text-[16px] font-black leading-[22px] text-primary">한 줄 소개</h3>
          <p className="mt-1 font-pretendard text-[14px] font-black leading-[22px] text-secondary">{store.description}</p>
        </div>

        <button
          type="button"
          onClick={() => onDetail(store.id)}
          className="w-full rounded-[16px] bg-brand py-4 text-base font-semibold text-white shadow-[0_10px_22px_0_rgba(21,95,58,0.24)]"
        >
          상세보기
        </button>
      </div>
    </div>
  )
}
