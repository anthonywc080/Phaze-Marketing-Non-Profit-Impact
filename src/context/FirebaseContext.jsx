import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth, googleProvider } from '../firebase/config'
import { signInWithPopup, onAuthStateChanged, signOut as fbSignOut } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useToast } from './ToastContext'

const FirebaseContext = createContext(null)

export function FirebaseProvider({ children }){
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const { showToast } = useToast()

  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, async (u)=>{
      setUser(u)
      if (u) {
        // Load or create user profile
        const userDoc = await getDoc(doc(db, 'users', u.uid))
        if (userDoc.exists()) {
          setUserProfile(userDoc.data())
        } else {
          // Create new profile - default to student
          const newProfile = {
            uid: u.uid,
            email: u.email,
            displayName: u.displayName,
            role: 'student', // default role
            createdAt: new Date()
          }
          await setDoc(doc(db, 'users', u.uid), newProfile)
          setUserProfile(newProfile)
        }
      } else {
        setUserProfile(null)
      }
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
    <FirebaseContext.Provider value={{ user, userProfile, signInWithGoogle, signOut }}>
      {children}
    </FirebaseContext.Provider>
  )
}

export function useFirebase(){
  const ctx = useContext(FirebaseContext)
  if(!ctx) throw new Error('useFirebase must be used within FirebaseProvider')
  return ctx
}
