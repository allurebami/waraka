import {neon} from '@neondatabase/serverless';
import {put,get,del} from '@vercel/blob';

type Params=unknown[];
type Statement={text:string,params:Params};
let sqlClient:ReturnType<typeof neon>|undefined;

function client(){
  if(!process.env.DATABASE_URL)throw new Error('Service de données indisponible.');
  return sqlClient??=neon(process.env.DATABASE_URL);
}

function placeholders(text:string){let n=0;return text.replace(/\?/g,()=>`$${++n}`)}

class Prepared {
  constructor(readonly text:string,readonly params:Params=[]){ }
  bind(...params:Params){return new Prepared(this.text,params)}
  descriptor():Statement{return {text:placeholders(this.text),params:this.params}}
  async all<T=Record<string,unknown>>(){const q=this.descriptor();const results=await client().query(q.text,q.params) as T[];return {results}}
  async first<T=Record<string,unknown>>(){const {results}=await this.all<T>();return results[0]??null}
  async run(){const q=this.descriptor();return client().query(q.text,q.params)}
}

export function database(){return {
  prepare(text:string){return new Prepared(text)},
  async batch(statements:Prepared[]){
    const sql=client();
    return sql.transaction(statements.map(s=>{const q=s.descriptor();return sql.query(q.text,q.params)}));
  },
}}

export function bucket(){return {
  async put(key:string,bytes:ArrayBuffer,options:{httpMetadata:{contentType:string}}){
    return put(key,Buffer.from(bytes),{access:'private',contentType:options.httpMetadata.contentType,addRandomSuffix:false});
  },
  async get(key:string){const result=await get(key,{access:'private'});return result?.statusCode===200?{body:result.stream}:null},
  async delete(key:string){return del(key)},
}}

export function administrator(email:string){
  const list=(process.env.WARAKA_ADMIN_EMAILS||'').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);
  return Boolean(email)&&list.includes(email.toLowerCase());
}
