import { useMemo } from 'react'

import ItemCard from '@/components/common/item-card'
import { useInvFilterStore } from '@renderer/store/useInvFilterStore'

import type { Item, InventoryItem } from '@renderer/types'

export default function InventoryGrid({
  items,
  inventory,
  onUpdateAmount,
  onEdit,
  onDelete
}: {
  items: Item[]
  inventory: InventoryItem[]
  onUpdateAmount: (id: number, amt: number) => void
  onEdit: (item: Item) => void
  onDelete: (id: number) => void
}) {
  const { searchQuery, filterInStock, filterCategory, showAmount, showPrice, showTotalValue } =
    useInvFilterStore()

  const displayData = useMemo(() => {
    return items
      .map((item) => {
        const inv = inventory.find((i) => i.itemId === item.id)
        return { ...item, amount: inv ? inv.amount : 0 }
      })
      .filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesInStock = filterInStock ? item.amount > 0 : true
        const matchesCategory = filterCategory === 'All' || item.category === filterCategory
        return matchesSearch && matchesInStock && matchesCategory
      })
  }, [items, inventory, searchQuery, filterInStock, filterCategory])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
      {displayData.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          showAmount={showAmount}
          showPrice={showPrice}
          showTotalValue={showTotalValue}
          onUpdateAmount={onUpdateAmount}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
      {displayData.length === 0 && (
        <div className="col-span-full py-20 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
          No items found
        </div>
      )}
    </div>
  )
}
