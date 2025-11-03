'use client'

import Navbar from './Navbar'
import Sidebar from './Sidebar'
import RightSidebar from './RightSidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-screen bg-gray-950">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gray-950">
          {children}
        </main>
        <RightSidebar />
      </div>
    </div>
  )
}

