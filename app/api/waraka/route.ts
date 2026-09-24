import {administrator,getWarakaUser,store} from '@/app/firebase-admin';
import {put,get,del} from '@vercel/blob';
import type {DocumentData,Query} from 'firebase-admin/firestore';
export const dynamic='force-dynamic';
export const runtime='nodejs';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
const now=()=>new Date().toISOString();
const clean=(v:unknown,max=3000)=>typeof v==='string'?v.trim().slice(0,max):'';
const collection=(name:string)=>store().collection(name);
async function one(name:string,id:string){const doc=await collection(name).doc(id).get();return doc.exists?{id:doc.id,...doc.data()}:null}
async function rows(name:string,field?:string,value?:unknown){const col=collection(name);const q:Query<DocumentData>=field?col.where(field,'==',value):col;return (await q.get()).docs.map(d=>({id:d.id,...d.data()})) as any[]}
const recent=(items:any[],field:string,limit?:number)=>items.sort((a,b)=>String(b[field]||'').localeCompare(String(a[field]||''))).slice(0,limit);

export async function GET(req:Request){try{
 const url=new URL(req.url),action=url.searchParams.get('action');
 if(action==='directory'){const records=(await rows('records','published',1)).sort((a,b)=>a.name.localeCompare(b.name));return json({records})}
 if(action==='verify'){const code=clean(url.searchParams.get('code'),80);if(!code)return json({error:'Saisissez une référence.'},400);const record=(await rows('records','code',code.toUpperCase())).find(r=>r.published===1);return json({record:record||null})}
 const user=await getWarakaUser(req);if(!user)return json({error:'Connectez-vous pour accéder à votre espace.'},401);
 if(action==='account'){const [profile,docs,records]=await Promise.all([one('profiles',user.userId),rows('documents','owner',user.userId),rows('records','owner',user.userId)]);return json({profile,documents:recent(docs,'created_at').map(({id,name,size,created_at})=>({id,name,size,created_at})),products:recent(records.filter(r=>r.kind==='produit'),'updated_at').map(({id,name,status})=>({id,name,status}))})}
 if(action==='document'){const id=clean(url.searchParams.get('id'),100);const doc=await one('documents',id) as any;if(!doc||doc.owner!==user.userId&&!administrator(user.email))return json({error:'Document non accessible.'},404);const file=await get(doc.object_key,{access:'private'});if(!file||file.statusCode!==200)return json({error:'Document introuvable.'},404);return new Response(file.stream,{headers:{'Content-Type':doc.mime,'Content-Disposition':"attachment; filename*=UTF-8''"+encodeURIComponent(doc.name),'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}})}
 if(action==='admin'){if(!administrator(user.email))return json({error:'Ce compte n’est pas habilité. L’accès doit être attribué à une adresse administratrice avant l’examen des dossiers.'},403);const [records,messages,logs,docs]=await Promise.all(['records','messages','audit','documents'].map(n=>rows(n)));return json({records:recent(records,'updated_at'),messages:recent(messages,'created_at',200),logs:recent(logs,'created_at',200),documents:docs.map(({id,owner,name})=>({id,owner,name}))})}
 return json({error:'Ressource introuvable.'},404);
 }catch(e){console.error('WARAKA read failed',e);return json({error:'Le chargement est momentanément indisponible. Réessayez.'},503)}}

export async function POST(req:Request){try{
 const origin=req.headers.get('origin');if(origin&&origin!==new URL(req.url).origin)return json({error:'Origine non autorisée.'},403);
 const user=await getWarakaUser(req);if(!user)return json({error:'Connectez-vous pour enregistrer votre contribution.'},401);
 const action=new URL(req.url).searchParams.get('action');
 if(action==='upload'){
  if(Number(req.headers.get('content-length')||0)>5.5*1024*1024)return json({error:'Le fichier dépasse 5 Mo.'},413);
  const f=(await req.formData()).get('file');if(!(f instanceof File)||!['application/pdf','image/jpeg','image/png'].includes(f.type)||f.size>5*1024*1024||f.size===0)return json({error:'Choisissez un PDF, JPEG ou PNG de moins de 5 Mo.'},400);
  const docs=await rows('documents','owner',user.userId);if(docs.length>=20)return json({error:'La limite de 20 documents est atteinte. Contactez l’équipe.'},400);
  const bytes=await f.arrayBuffer(),magic=new Uint8Array(bytes.slice(0,8));const valid=f.type==='application/pdf'?String.fromCharCode(...magic.slice(0,5))==='%PDF-':f.type==='image/png'?magic[0]===137&&magic[1]===80&&magic[2]===78&&magic[3]===71:magic[0]===255&&magic[1]===216&&magic[2]===255;if(!valid)return json({error:'Le contenu du fichier ne correspond pas au format annoncé.'},400);
  const id=crypto.randomUUID(),key='documents/'+user.userId+'/'+id;const file=await put(key,Buffer.from(bytes),{access:'private',contentType:f.type,addRandomSuffix:false});try{await collection('documents').doc(id).create({owner:user.userId,name:clean(f.name,200),size:f.size,mime:f.type,object_key:file.url,created_at:now()})}catch(e){await del(file.url);throw e}return json({ok:true,id});
 }
 if(Number(req.headers.get('content-length')||0)>24000)return json({error:'Le contenu est trop volumineux.'},413);let b:any;try{b=await req.json()}catch{return json({error:'Les informations transmises sont invalides.'},400)}
 if(action==='profile'){
  const name=clean(b.name,120),category=clean(b.category,120),city=clean(b.city,120),region=clean(b.region,80),description=clean(b.description,3000),role=clean(b.role,30);
  if(!name||!category||!city||!region||!description||!b.consent||!['praticien','entreprise','utilisateur'].includes(role))return json({error:'Complétez les champs obligatoires et acceptez les conditions.'},400);
  const latitude=b.latitude===''||b.latitude==null?null:Number(b.latitude),longitude=b.longitude===''||b.longitude==null?null:Number(b.longitude);if(latitude!==null&&(!Number.isFinite(latitude)||Math.abs(latitude)>90)||longitude!==null&&(!Number.isFinite(longitude)||Math.abs(longitude)>180))return json({error:'Coordonnées géographiques invalides.'},400);
  const stamp=now(),batch=store().batch();batch.set(collection('profiles').doc(user.userId),{owner:user.userId,name,role,category,city,region,phone:clean(b.phone,30),languages:clean(b.languages,150),hours:clean(b.hours,200),address:clean(b.address,250),latitude,longitude,description,consent:1,status:'Brouillon',updated_at:stamp},{merge:true});
  for(const r of await rows('records','owner',user.userId))if(r.kind!=='produit')batch.update(collection('records').doc(r.id),{published:0,status:'Brouillon',updated_at:stamp});await batch.commit();return json({ok:true});
 }
 if(action==='submit'){
  const p=await one('profiles',user.userId) as any,docs=await rows('documents','owner',user.userId);if(!p||!docs.length||p.role==='utilisateur')return json({error:'Un profil professionnel complet et au moins un document sont nécessaires.'},400);
  const stamp=now(),batch=store().batch();batch.set(collection('records').doc('profile-'+user.userId),{owner:user.userId,kind:p.role,name:p.name,category:p.category,city:p.city,region:p.region,phone:p.phone,description:p.description+'\n\nLangues : '+p.languages+'\nHoraires : '+p.hours+'\nAdresse : '+p.address,latitude:p.latitude,longitude:p.longitude,status:'En cours de vérification',published:0,updated_at:stamp},{merge:true});batch.update(collection('profiles').doc(user.userId),{status:'En cours de vérification',updated_at:stamp});await batch.commit();return json({ok:true});
 }
 if(action==='product'){
  const name=clean(b.name,120),manufacturer=clean(b.manufacturer,180),category=clean(b.category,100),composition=clean(b.composition,1800),description=clean(b.description,1800);if(!name||!manufacturer||!category||!composition||!description)return json({error:'Complétez les informations obligatoires du produit.'},400);
  const p=await one('profiles',user.userId) as any;if(!p)return json({error:'Enregistrez d’abord votre profil professionnel.'},400);const id=crypto.randomUUID();await collection('records').doc(id).create({owner:user.userId,kind:'produit',name,category,city:p.city,region:p.region,description:description+'\n\nFabricant déclaré : '+manufacturer+'\nComposition déclarée : '+composition+'\nAutorisation déclarée : '+(clean(b.authorization,100)||'Non renseignée'),status:'En cours de vérification',published:0,updated_at:now()});return json({ok:true,id});
 }
 if(action==='message'){
  const message=clean(b.message,3000);if(!message||!['contact','partenariat','signalement'].includes(b.kind))return json({error:'Renseignez votre message.'},400);const messages=await rows('messages','owner',user.userId);if(messages.filter(m=>m.created_at>new Date(Date.now()-3600000).toISOString()).length>=15)return json({error:'Trop de messages. Veuillez réessayer plus tard.'},429);await collection('messages').doc(crypto.randomUUID()).create({owner:user.userId,kind:b.kind,name:clean(b.name,120),email:clean(b.email,200)||user.email,target:clean(b.target,200),message,created_at:now()});return json({ok:true});
 }
 if(action==='review'){
  if(!administrator(user.email))return json({error:'Accès administrateur requis.'},403);const id=clean(b.id,120),note=clean(b.note,1500);if(!note||!['approve','reject'].includes(b.decision))return json({error:'Précisez une décision et le périmètre du contrôle.'},400);const record=await one('records',id) as any;if(!record)return json({error:'Dossier introuvable.'},404);
  const approve=b.decision==='approve';if(approve&&!(await rows('documents','owner',record.owner)).length)return json({error:'Au moins un document est requis avant validation.'},400);const status=approve?'Documents vérifiés':'À corriger',stamp=now(),code=record.code||('WRK-'+crypto.randomUUID().slice(0,8).toUpperCase()),batch=store().batch();batch.update(collection('records').doc(id),{status,published:approve?1:0,code,verified_at:approve?stamp:null,updated_at:stamp});batch.create(collection('audit').doc(crypto.randomUUID()),{actor:user.userId,action:status,target:id,note,created_at:stamp});if(record.kind!=='produit')batch.update(collection('profiles').doc(record.owner),{status,review_note:note,updated_at:stamp});await batch.commit();return json({ok:true});
 }
 return json({error:'Action inconnue.'},404);
 }catch(e){console.error('WARAKA write failed',e);return json({error:'L’enregistrement a échoué. Vos champs sont conservés ; vous pouvez réessayer.'},503)}}
