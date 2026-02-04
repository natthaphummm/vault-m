import { useMemo } from 'react'

import ItemCard from '@/components/inventory/item-card'
import { Card, CardContent } from '@/components/ui/card'
import { useInventoryStore } from '@/store/useInventoryStore'
import { PackageX } from 'lucide-react'

import type { Item, InventoryItem } from '@renderer/types'

export default function InventoryGrid({
  items,
  inventory,
  onUpdateAmount,
  onDelete
}: {
  items: Item[]
  inventory: InventoryItem[]
  onUpdateAmount: (id: number, amt: number) => void
  onDelete: (id: number) => void
}) {
  const {
    searchQuery,
    filterInStock,
    filterCategory,
    showAmount,
    showPrice,
    showTotalValue,
    openEditItemDialog
  } = useInventoryStore()

  const displayData = useMemo(() => {
    return items
      .map((item) => {
        const inv = inventory.find((i) => i.itemId === item.id)
        return { ...item, image: item.image, amount: inv ? inv.amount : 0 }
      })
      .filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesInStock = filterInStock ? item.amount > 0 : true
        const matchesCategory = filterCategory === 'All' || item.category === filterCategory
        return matchesSearch && matchesInStock && matchesCategory
      })
  }, [items, inventory, searchQuery, filterInStock, filterCategory])

  return (
    <div className="w-full px-4 md:px-6 pb-4 md:pb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {displayData.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          showAmount={showAmount}
          showPrice={showPrice}
          showTotalValue={showTotalValue}
          onUpdateAmount={onUpdateAmount}
          onEdit={openEditItemDialog}
          onDelete={onDelete}
        />
      ))}
      {displayData.length === 0 && (
        <Card className="col-span-full border-2 border-dashed bg-muted/50">
          <CardContent className="flex flex-col items-center justify-center h-48 space-y-4 text-center">
            <div className="p-3 rounded-full bg-background border shadow-sm">
              <PackageX className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">No items found</h3>
              <p className="text-sm text-muted-foreground">
                Adjust your filters or add a new item to get started.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
