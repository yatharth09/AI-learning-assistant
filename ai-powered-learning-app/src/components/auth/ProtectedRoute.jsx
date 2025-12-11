import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import AppLayout from '../layout/AppLayout'

const ProtectedRoute = () => {
    const isAuthenticated = true
    const loading = false

    if(loading){
        return (<div className='flex items-center justify-center'>Loading...</div>)
    }

  return isAuthenticated? (
    <AppLayout>
        <Outlet />
    </AppLayout>
    
  ):(<Navigate to='/login' replace />)
}

export default ProtectedRoute