import {env} from 'cloudflare:workers';
export function database(){if(!env.DB)throw new Error('Service de données indisponible.');return env.DB;}
export function bucket(){if(!env.BUCKET)throw new Error('Service de documents indisponible.');return env.BUCKET;}
export function administrator(email:string){const list=((env as any).WARAKA_ADMIN_EMAILS||'').split(',').map((s:string)=>s.trim().toLowerCase()).filter(Boolean);return list.includes(email.toLowerCase());}
