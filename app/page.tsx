import Waraka from './waraka';
import {getWarakaUser} from './auth';
export const dynamic='force-dynamic';
export default async function Page(){const user=await getWarakaUser();return <Waraka path="/" user={user?{name:user.displayName,email:user.email}:null}/>}
