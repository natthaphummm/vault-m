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
      className={`group relative aspect-square border-border border rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col bg-card text-card-foreground
                ${item.amount === 0 ? 'opacity-60 grayscale' : ''}`}
    >
      {/* Image Area */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-0">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="size-24 object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <HelpCircle size={48} className="text-muted-foreground/20" />
        )}
      </div>

      {/* Top Right Badges */}
      <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 z-10 pointer-events-none">
        {showAmount && <Badge variant="secondary">x{item.amount?.toLocaleString()}</Badge>}
        {showPrice && <Badge variant="outline">${item.price.toLocaleString()}</Badge>}
        {showTotalValue && (
          <Badge className="bg-primary text-primary-foreground">
            Σ ${(item.price * (item.amount ?? 0)).toLocaleString()}
          </Badge>
        )}
      </div>

      {/* Category Badge */}
      <div className="absolute top-3 left-3 z-10 pointer-events-none">
        <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
          {item.category.substring(0, 8)}
        </Badge>
      </div>

      {/* Bottom Info */}
      <div className="absolute inset-x-0 bottom-0 p-3 z-10 bg-card/95 backdrop-blur-sm border-t border-border">
        <div className="font-bold text-sm truncate text-center">{item.name}</div>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 flex flex-col items-center justify-center gap-3">
        <div className="flex items-center bg-card rounded-lg p-1 border border-border shadow-md">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onUpdateAmount(item.id, (item.amount ?? 0) - 1)}
          >
            -
          </Button>
          <span className="w-16 text-center text-sm font-bold">{item.amount}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onUpdateAmount(item.id, (item.amount ?? 0) + 1)}
          >
            +
          </Button>
        </div>
        {showAmount || showPrice || showTotalValue ? null : (
          <div className="text-[10px] text-muted-foreground font-mono flex flex-col items-center">
            <span className="text-green-600 dark:text-green-400">
              ${item.price.toLocaleString()}
            </span>
            <span>x{item.amount}</span>
          </div>
        )}
        <div className="flex gap-2">
          <Button size="icon" variant="outline" onClick={() => onEdit(item)}>
            <Edit size={16} />
          </Button>
          <Button size="icon" variant="destructive" onClick={() => onDelete(item.id)}>
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}
