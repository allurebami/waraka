import {cert,getApps,initializeApp} from 'firebase-admin/app';
import {getAuth} from 'firebase-admin/auth';
import {getFirestore} from 'firebase-admin/firestore';
import {getStorage} from 'firebase-admin/storage';

function firebaseAdmin(){
  if(getApps().length)return getApps()[0];
  const projectId=process.env.FIREBASE_PROJECT_ID;
  const clientEmail=process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey=process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g,'\n');
  const storageBucket=process.env.FIREBASE_STORAGE_BUCKET;
  if(!projectId||!clientEmail||!privateKey||!storageBucket)throw new Error('Configuration Firebase incomplète.');
  return initializeApp({credential:cert({projectId,clientEmail,privateKey}),storageBucket});
}
export function store(){return getFirestore(firebaseAdmin())}
export function files(){return getStorage(firebaseAdmin()).bucket()}
export async function getWarakaUser(req:Request){
  const header=req.headers.get('authorization')||'';
  if(!header.startsWith('Bearer '))return null;
  try{
    const token=await getAuth(firebaseAdmin()).verifyIdToken(header.slice(7),true);
    const account=await getAuth(firebaseAdmin()).getUser(token.uid);
    return {userId:token.uid,email:account.emailVerified?account.email||'':'',displayName:account.displayName||account.email||''};
  }catch{return null}
}
export function administrator(email:string){return Boolean(email)&&(process.env.WARAKA_ADMIN_EMAILS||'').split(',').map(s=>s.trim().toLowerCase()).includes(email.toLowerCase())}
