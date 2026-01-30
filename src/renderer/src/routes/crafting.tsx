import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/crafting')({
  component: Crafting
})

function Crafting() {
  return <div className="p-2">Hello from Crafting!</div>
}
