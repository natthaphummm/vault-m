// import Versions from './components/Versions'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@renderer/components/ui/tabs'

function App(): React.JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <main className="min-h-screen font-sans mx-auto p-2 bg-amber-200">
      <Tabs defaultValue="inventory" className="w-full">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="crafting">Crafting</TabsTrigger>
        </TabsList>
        <TabsContent value="inventory" className="bg-amber-600">
          Inventory
        </TabsContent>
        <TabsContent value="crafting" className="bg-amber-600">
          Crafting
        </TabsContent>
      </Tabs>
    </main>
  )
}

export default App
