/*
Seed Firestore with sample data.

Usage:
- For emulator: set FIRESTORE_EMULATOR_HOST (e.g. localhost:8080) and run:
  FIRESTORE_EMULATOR_HOST=localhost:8080 node scripts/seedFirestore.js

- For real project: set GOOGLE_APPLICATION_CREDENTIALS to service account JSON path:
  GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json node scripts/seedFirestore.js
*/

const admin = require('firebase-admin')

function initAdmin(){
  const usingEmulator = !!process.env.FIRESTORE_EMULATOR_HOST
  if(usingEmulator){
    admin.initializeApp()
    console.log('Initialized admin SDK for emulator')
    return
  }

  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.SERVICE_ACCOUNT_KEY
  if(!credPath){
    console.error('No service account path provided. Set GOOGLE_APPLICATION_CREDENTIALS or SERVICE_ACCOUNT_KEY env var, or use emulator.')
    process.exit(1)
  }
  const serviceAccount = require(require('path').resolve(credPath))
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
  console.log('Initialized admin SDK with service account')
}

async function seed(){
  initAdmin()
  const db = admin.firestore()

  console.log('Seeding donations...')
  const donations = [
    { donor: 'Seed Fund', amount: 1200, time: new Date().toISOString() },
    { donor: 'Ally', amount: 200, time: new Date().toISOString() },
    { donor: 'Community Partner', amount: 500, time: new Date().toISOString() }
  ]
  for(const d of donations){
    await db.collection('donations').add(d)
  }

  console.log('Seeding pipeline documents...')
  await db.doc('pipeline/applied').set({ items: [{id:1,name:'Sam'},{id:2,name:'Jill'}] })
  await db.doc('pipeline/interviewing').set({ items: [{id:3,name:'Alex'}] })
  await db.doc('pipeline/accepted').set({ items: [] })

  console.log('Seeding clients...')
  await db.collection('clients').add({ name: 'Heights Philadelphia', plan: 'Pro', users: 12, status: 'Active' })
  await db.collection('clients').add({ name: 'Bright Futures', plan: 'Free', users: 3, status: 'Trial' })

  console.log('Seed complete')
  process.exit(0)
}

seed().catch(err => { console.error(err); process.exit(1) })
