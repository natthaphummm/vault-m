import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/inventory')({
  component: Inventory
})

function Inventory() {
  return <div className="p-2">Hello from Inventory!</div>
}
