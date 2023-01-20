import { createContext, useState } from 'react'

export const LayoutContext = createContext({
  isSidebarOpen: true,
  setIsSidebarOpen: () => {},
})

export default function LayoutProvider({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const context = {
    isSidebarOpen,
    setIsSidebarOpen,
  }

  return (
    <LayoutContext.Provider value={context}>{children}</LayoutContext.Provider>
  )
}
