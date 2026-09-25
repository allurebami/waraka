import Waraka from '../waraka';
export default async function Page({params}:{params:Promise<{path:string[]}>}){const p=await params;return <Waraka path={'/'+p.path.join('/')}/>}
