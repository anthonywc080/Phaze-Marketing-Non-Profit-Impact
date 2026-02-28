import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth, googleProvider } from '../firebase/config'
import { signInWithPopup, onAuthStateChanged, signOut as fbSignOut } from 'firebase/auth'
import { useToast } from './ToastContext'

const FirebaseContext = createContext(null)

export function FirebaseProvider({ children }){
  const [user, setUser] = useState(null)
  const { showToast } = useToast()

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, (u)=>{
      setUser(u)
    })
    return unsub
  },[])

  async function signInWithGoogle(){
    try{
      await signInWithPopup(auth, googleProvider)
      showToast('Signed in', 'success')
    }catch(e){
      showToast('Sign-in failed', 'danger')
    }
  }

  async function signOut(){
    await fbSignOut(auth)
    showToast('Signed out', 'info')
  }

  return (
    <FirebaseContext.Provider value={{ user, signInWithGoogle, signOut }}>
      {children}
    </FirebaseContext.Provider>
  )
}

export function useFirebase(){
  const ctx = useContext(FirebaseContext)
  if(!ctx) throw new Error('useFirebase must be used within FirebaseProvider')
  return ctx
}
