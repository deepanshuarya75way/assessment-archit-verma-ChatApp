import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import SettingsPage from './pages/SettingsPage'
import ProfilePage from './pages/ProfilePage'

import { Toaster } from "react-hot-toast";
import { useAuthStore } from './store/useAuthStore.js'
import { Loader } from 'lucide-react'
import Navbar from './components/Navbar'
import { useThemeStore } from './store/useThemeStore';
import { useGroupStore } from './store/useGroupStore.js'



const App = () => {
  const {authUser , checkAuth , isCheckingAuth ,onlineUsers } = useAuthStore();

  const {getMyGroups}= useGroupStore()

  const {theme} = useThemeStore();
  useEffect(() => {
  document.documentElement.setAttribute("data-theme", theme);
}, [theme]);
console.log(theme)

useEffect(()=>{
  if(authUser){
    getMyGroups()
  }
},[authUser])

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return <div className='h-screen flex items-center justify-center'><Loader className='size-10 animate-spin'/></div>

     return (
    <div className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin' />
    </div>
  )

  }
  

  return (
    <>
      <div>
          <Navbar />
        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        </Routes>

        <Toaster />
      </div>
    </>
  )
}

export default App