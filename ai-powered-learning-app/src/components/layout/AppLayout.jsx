import {useState} from 'react'
import Sidebar from './Sidebar.jsx'
import Header from './Header.jsx'

const AppLayout = ({children}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }


  return (
    <div className='flex h-screen bg-neutral-50 text-neutral-900'>
      <Sidebar isSidebarOpen={isSidebarOpen} toggle={toggleSidebar}/>
      <div className='flex-1 flex flex-col overflow-hidden'>
        <Header toggle={toggleSidebar}/>
        <main className='flex-1 overflow-x-hidden overflow-y-auto p-6'>
          {children}
        </main>

      </div>
    </div>
  )
}

export default AppLayout