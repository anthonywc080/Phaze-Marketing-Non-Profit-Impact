import { collection, addDoc, onSnapshot, doc, setDoc, getDoc, updateDoc, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from './config'

export async function updateStudent(id, patch) {
  try {
    const studentDoc = doc(db, 'students', id)
    await updateDoc(studentDoc, patch)
  } catch (e) {
    console.warn('Failed to update student', e)
    throw e
  }
}

export function listenDonations(cb) {
  try {
    const col = collection(db, 'donations')
    return onSnapshot(col, (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      cb(items)
    })
  } catch (e) {
    console.warn('Firestore not configured', e)
    return () => {}
  }
}

export async function addDonation(d) {
  try {
    const docRef = await addDoc(collection(db, 'donations'), d)
    return docRef.id
  } catch (e) {
    console.warn('Failed to add donation', e)
    throw e
  }
}

export function listenPipeline(cb) {
  try {
    const col = collection(db, 'pipeline')
    return onSnapshot(col, (snap) => {
      const items = {}
      snap.docs.forEach(d => {
        items[d.id] = d.data()
      })
      cb(items)
    })
  } catch (e) {
    console.warn('Firestore not configured', e)
    return () => {}
  }
}

export async function setPipelineDoc(id, data){
  try{
    await setDoc(doc(db, 'pipeline', id), data)
  }catch(e){
    console.warn('Failed to set pipeline', e)
    throw e
  }
}

// Campaigns
export function listenCampaigns(cb) {
  try {
    const col = collection(db, 'campaigns')
    return onSnapshot(col, (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      cb(items)
    })
  } catch (e) {
    console.warn('Firestore not configured', e)
    return () => {}
  }
}

export async function addCampaign(campaign) {
  try {
    const docRef = await addDoc(collection(db, 'campaigns'), {
      ...campaign,
      createdAt: new Date(),
      status: 'draft'
    })
    return docRef.id
  } catch (e) {
    console.warn('Failed to add campaign', e)
    throw e
  }
}

export async function updateCampaign(id, data) {
  try {
    await updateDoc(doc(db, 'campaigns', id), data)
  } catch (e) {
    console.warn('Failed to update campaign', e)
    throw e
  }
}

// Tasks
export function listenTasks(cb) {
  try {
    const col = collection(db, 'tasks')
    return onSnapshot(col, (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      cb(items)
    })
  } catch (e) {
    console.warn('Firestore not configured', e)
    return () => {}
  }
}

export async function addTask(task) {
  try {
    const docRef = await addDoc(collection(db, 'tasks'), {
      ...task,
      createdAt: new Date(),
      status: 'open'
    })
    return docRef.id
  } catch (e) {
    console.warn('Failed to add task', e)
    throw e
  }
}

export async function updateTask(id, data) {
  try {
    await updateDoc(doc(db, 'tasks', id), data)
  } catch (e) {
    console.warn('Failed to update task', e)
    throw e
  }
}

export async function claimTask(taskId, studentId) {
  try {
    await updateTask(taskId, { studentId, status: 'claimed', claimedAt: new Date() })
  } catch (e) {
    console.warn('Failed to claim task', e)
    throw e
  }
}

export async function submitTaskProof(taskId, proofUrl) {
  try {
    await updateTask(taskId, { proofUrl, status: 'pending_verification', submittedAt: new Date() })
  } catch (e) {
    console.warn('Failed to submit proof', e)
    throw e
  }
}

export async function approveTask(taskId) {
  try {
    await updateTask(taskId, { status: 'approved', approvedAt: new Date() })
  } catch (e) {
    console.warn('Failed to approve task', e)
    throw e
  }
}

export function listenSessionLogs(cb) {
  try {
    const col = collection(db, 'sessionLogs')
    const q = query(col, orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      cb(items)
    })
  } catch (e) {
    console.warn('Firestore not configured for session logs', e)
    return () => {}
  }
}

export async function addSessionLog(log) {
  try {
    const docRef = await addDoc(collection(db, 'sessionLogs'), log)
    return docRef.id
  } catch (e) {
    console.warn('Failed to add session log', e)
    throw e
  }
}

// Users
export async function getUserProfile(uid) {
  try {
    const docSnap = await getDoc(doc(db, 'users', uid))
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    }
    return null
  } catch (e) {
    console.warn('Failed to get user profile', e)
    return null
  }
}

export async function updateUserProfile(uid, data) {
  try {
    await updateDoc(doc(db, 'users', uid), data)
  } catch (e) {
    console.warn('Failed to update user profile', e)
    throw e
  }
}

// Applications - dedicated collection for student applications
export function listenApplications(studentId, cb) {
  try {
    const q = query(collection(db, 'applications'), where('studentId', '==', studentId), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      cb(items)
    })
  } catch (e) {
    console.warn('Firestore not configured for applications', e)
    return () => {}
  }
}

export async function submitApplication(data) {
  try {
    const docRef = await addDoc(collection(db, 'applications'), {
      ...data,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    })
    return docRef.id
  } catch (e) {
    console.warn('Failed to submit application', e)
    throw e
  }
}

export async function updateApplication(appId, data) {
  try {
    await updateDoc(doc(db, 'applications', appId), {
      ...data,
      updatedAt: new Date()
    })
  } catch (e) {
    console.warn('Failed to update application', e)
    throw e
  }
}
