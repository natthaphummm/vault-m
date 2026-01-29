import { Trash2, HelpCircle, Edit } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import type { Item } from '@renderer/types'

export default function ItemCard({
  item,
  showAmount,
  showPrice,
  showTotalValue,
  onUpdateAmount,
  onEdit,
  onDelete
}: {
  item: Item
  showAmount: boolean
  showPrice: boolean
  showTotalValue: boolean
  onUpdateAmount: (itemId: number, newAmount: number) => void
  onEdit: (item: Item) => void
  onDelete: (itemId: number) => void
}) {
  return (
    <div
      key={item.id}
      className={`group relative aspect-square bg-white border border-gray-200 rounded shadow hover:shadow-lg transition-all overflow-hidden flex flex-col
                ${item.amount === 0 ? 'opacity-60 grayscale' : ''}`}
    >
      {/* Image Area */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-0">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <HelpCircle size={48} className="text-gray-300" />
        )}
      </div>

      {/* Top Right Badges */}
      <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 z-10 pointer-events-none">
        {showAmount && <Badge variant="outline">x{item.amount.toLocaleString()}</Badge>}
        {showPrice && <Badge variant="outline">${item.price.toLocaleString()}</Badge>}
        {showTotalValue && (
          <Badge variant="outline">Σ ${(item.price * item.amount).toLocaleString()}</Badge>
        )}
      </div>

      {/* Category Badge */}
      <div className="absolute top-3 left-3 z-10 pointer-events-none">
        <Badge variant="outline">{item.category.substring(0, 8)}</Badge>
      </div>

      {/* Bottom Info */}
      <div className="absolute inset-x-0 bottom-0 p-3 z-10 bg-white border-t border-gray-100">
        <div className="font-bold text-gray-800 text-sm truncate text-center">{item.name}</div>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-white/90 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 flex flex-col items-center justify-center gap-3">
        <div className="flex items-center bg-white rounded-lg p-1 border border-gray-200 shadow-md">
          <Button variant="outline" onClick={() => onUpdateAmount(item.id, item.amount - 1)}>
            -
          </Button>
          <span className="w-10 text-center text-sm font-bold text-gray-800">{item.amount}</span>
          <Button variant="outline" onClick={() => onUpdateAmount(item.id, item.amount + 1)}>
            +
          </Button>
        </div>
        {showAmount || showPrice || showTotalValue ? null : (
          <div className="text-[10px] text-gray-500 font-mono flex flex-col items-center">
            <span className="text-green-600">${item.price.toLocaleString()}</span>
            <span>x{item.amount}</span>
          </div>
        )}
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onEdit(item)}>
            <Edit size={16} />
          </Button>
          <Button variant="outline" onClick={() => onDelete(item.id)}>
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}
