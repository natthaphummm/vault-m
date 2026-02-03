import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Coins, Layers, Scroll, Package } from 'lucide-react'
import { useMemo } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/')({
  component: Index
})

function Index() {
  const { data: items = [], isLoading: isLoadingItems } = useQuery({
    queryKey: ['items'],
    queryFn: async () => await window.api.items.getAll()
  })

  const { data: inventory = [], isLoading: isLoadingInventory } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => await window.api.inventory.getAll()
  })

  const { data: recipes = [], isLoading: isLoadingRecipes } = useQuery({
    queryKey: ['recipes'],
    queryFn: async () => await window.api.crafting.getAll()
  })

  const stats = useMemo(() => {
    const totalItems = inventory.reduce((acc, curr) => acc + curr.amount, 0)

    const totalValue = inventory.reduce((acc, curr) => {
      const item = items.find((i) => i.id === curr.itemId)
      return acc + (item ? item.price * curr.amount : 0)
    }, 0)

    const recipeCount = recipes.length

    // Top stocked items for visualization
    const sortedInventory = [...inventory].sort((a, b) => b.amount - a.amount)
    const maxAmount = sortedInventory.length > 0 ? sortedInventory[0].amount : 100

    const topItems = sortedInventory.slice(0, 5).map((invItem) => {
      const item = items.find((i) => i.id === invItem.itemId)
      return {
        name: item?.name || 'Unknown Item',
        amount: invItem.amount,
        max: maxAmount
      }
    })

    const moneyItem = inventory.find((inv) => {
      const item = items.find((i) => i.id === inv.itemId)
      return item?.name === 'money' || item?.name === 'Money'
    })
    const totalMoney = moneyItem ? moneyItem.amount : 0

    return { totalItems, totalValue, recipeCount, topItems, totalMoney }
  }, [items, inventory, recipes])

  const isLoading = isLoadingItems || isLoadingInventory || isLoadingRecipes

  return (
    <div className="w-full">
      <div className="px-4 md:px-6 pt-4 md:pt-6">
        <h1 className="mb-4 scroll-m-20 text-2xl font-extrabold tracking-tight text-balance">
          Vault-M
        </h1>
      </div>

      {/* Stats Section */}
      <div className="p-4 grid gap-2 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Money</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <div className="text-2xl font-bold text-green-500">
                ${stats.totalMoney.toLocaleString()}
              </div>
            )}
            <p className="text-xs text-muted-foreground">Cash on hand</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <div className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</div>
            )}
            <p className="text-xs text-muted-foreground">Across all inventory items</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items in Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats.totalItems.toLocaleString()}</div>
            )}
            <p className="text-xs text-muted-foreground">Individual units stored</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Recipes</CardTitle>
            <Scroll className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <div className="text-2xl font-bold">{stats.recipeCount}</div>
            )}
            <p className="text-xs text-muted-foreground">Available for crafting</p>
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Stocked</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {isLoading ? (
              <div className="space-y-2 mt-4">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-10/12" />
                <Skeleton className="h-3 w-9/12" />
              </div>
            ) : stats.topItems.length > 0 ? (
              <div className="space-y-3 mt-4">
                {stats.topItems.slice(0, 3).map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium truncate max-w-[100px]">{item.name}</span>
                      <span className="text-muted-foreground">{item.amount}</span>
                    </div>
                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${(item.amount / (stats.topItems[0]?.amount || 1)) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-muted-foreground mt-4">No stock data available</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
