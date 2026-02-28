import { collection, addDoc, onSnapshot, doc, setDoc } from 'firebase/firestore'
import { db } from './config'

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
