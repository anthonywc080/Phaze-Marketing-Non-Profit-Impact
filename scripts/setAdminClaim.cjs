const admin = require('firebase-admin')
const path = require('path')

function initAdmin(){
  const usingEmulator = !!process.env.FIRESTORE_EMULATOR_HOST
  if(usingEmulator){
    admin.initializeApp()
    return
  }
  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.SERVICE_ACCOUNT_KEY
  if(!credPath){
    console.error('No service account path provided. Set GOOGLE_APPLICATION_CREDENTIALS or SERVICE_ACCOUNT_KEY env var, or use emulator.')
    process.exit(1)
  }
  const serviceAccount = require(path.resolve(credPath))
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
}

async function setAdmin(uid){
  initAdmin()
  if(!uid){
    console.error('Usage: node scripts/setAdminClaim.cjs <UID>')
    process.exit(1)
  }
  try{
    await admin.auth().setCustomUserClaims(uid, { admin: true })
    console.log('Set admin claim for', uid)
  }catch(e){
    console.error('Failed to set claim', e)
  }
}

setAdmin(process.argv[2])
