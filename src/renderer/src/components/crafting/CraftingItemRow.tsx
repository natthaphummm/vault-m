import { HelpCircle, Shield, Trash2, Box } from 'lucide-react'
import { Item } from '../../types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { memo } from 'react'

export const CraftingItemRow = memo(
  ({
    item,
    requiredAmount,
    inventoryAmount,
    remove = true
  }: {
    item?: Item
    requiredAmount: number
    inventoryAmount?: number
    remove?: boolean
  }) => {
    if (!item) return <div className="h-16 bg-muted rounded-lg animate-pulse" />

    const hasEnough = (inventoryAmount || 0) >= requiredAmount

    return (
      <div
        className={cn(
          'flex items-center gap-3 p-3 rounded-xl border transition-all',
          hasEnough
            ? 'bg-card border-border hover:shadow-sm'
            : 'bg-destructive/10 border-destructive/20 opacity-90'
        )}
      >
        <div className="w-10 h-10 bg-muted/50 border rounded-lg flex items-center justify-center shrink-0 overflow-hidden p-1">
          {item.image ? (
            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
          ) : (
            <HelpCircle className="text-muted-foreground" size={20} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm truncate">{item.name}</div>
          <div className="flex items-center gap-2 mt-1">
            {!remove ? (
              <Badge
                variant="outline"
                className="h-5 px-1.5 text-[10px] gap-1 bg-blue-50 text-blue-700 border-blue-200"
              >
                <Shield size={10} /> Keep
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="h-5 px-1.5 text-[10px] gap-1 text-muted-foreground"
              >
                Consume
              </Badge>
            )}
          </div>
        </div>

        <div className="text-right">
          <div
            className={cn(
              'font-mono font-bold text-sm',
              hasEnough ? 'text-green-600' : 'text-destructive'
            )}
          >
            {inventoryAmount}/{requiredAmount}
          </div>
        </div>
      </div>
    )
  }
)
