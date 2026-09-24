import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {neon} from '@neondatabase/serverless';

if(!process.env.DATABASE_URL)throw new Error('DATABASE_URL est requis pour créer les tables.');
const sql=neon(process.env.DATABASE_URL);
const file=fileURLToPath(new URL('../db/postgres.sql',import.meta.url));
for(const statement of readFileSync(file,'utf8').split('--> statement-breakpoint').map(s=>s.trim()).filter(Boolean)){
  await sql.query(statement);
}
console.log('Tables WARAKA disponibles.');
