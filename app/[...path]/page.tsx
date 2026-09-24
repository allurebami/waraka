import Waraka from '../waraka';
import {getWarakaUser} from '../auth';
export const dynamic='force-dynamic';
export default async function Page({params}:{params:Promise<{path:string[]}>}){const p=await params; const user=await getWarakaUser(); return <Waraka path={'/'+p.path.join('/')} user={user?{name:user.displayName,email:user.email}:null}/>}
