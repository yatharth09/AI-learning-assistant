import { useAuth } from '../../context/AuthContext'
import {Bell, User, Menu} from 'lucide-react'
import { useEffect, useState } from 'react'


const Header = ({toggle}) => {
    const {user, email, notif} = useAuth()
    useEffect(() => {
        console.log(user)
    })

    const [showNotification, setShowNotificaiton] = useState(false)

  return (
    <header className='sticky top-0 z-40 w-full h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200/60'>
        <div className='flex items-center justify-between h-full px-6'>
            <button onClick={toggle}
                className='md:hidden inline-flex items-center justify-center h-10 w-10 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200'
                aria-label='Toggle Sidebar'
            >
                <Menu size={24} />
            </button>
            <div className='hidden md:block'></div>
            <div className='flex items-center gap-3'>
                <button onClick={() => setShowNotificaiton(!showNotification)} className='relative inline-flex items-center justify-center w-10 h-10 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200 group'>
                    <Bell size={20} strokeWidth={2} className='group-hover:scale-110 transition-transform duration-200'/>
                    <span className='absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white'></span>
                    
                </button>

                <div className='flex items-center gap-3 pl-3 border-l border-slate-200/60'>
                    <div className='flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors duration-200'>
                        <div className='w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:shadow-lg group-hover:shadow-emerald-500/30 transition-all duration-200'>
                            <User size={18} strokeWidth={2.5}/>
                        </div>
                        <div>
                            <p className='text-sm font-semibold text-slate-900'>{user || "User"} </p>
                            <p className='text-xs text-slate-500'>{email || "user@example.com"}</p>
                        </div>
                    </div>
                </div>

                
            </div>
        </div>

        {showNotification && <div
  className="
    w-80 h-100 absolute border rounded-xl rounded-tr-none right-60
    bg-white backdrop-blur-md
    shadow-xl shadow-black/10
    border-slate-200
    p-4
    space-y-2
    overflow-hidden
  "
>
    <h1 className='text-lg font-semibold text-slate-800 tracking-tight mb-3'>Notifications</h1>
  {notif?.map((notification, key) => {
    return (
      <p
        key={key}
        className="
          text-sm text-slate-700
          bg-slate-100/70
          px-3 py-2
          rounded-lg
          shadow-sm
          animate-fade-in
        "
      >
        {notification}
      </p>
    );
  })}
</div>}



    </header>
  )
}

export default Header