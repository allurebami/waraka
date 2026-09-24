import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'WARAKA — La connaissance traditionnelle, mieux encadrée.',description:'Explorez le patrimoine botanique, les savoirs traditionnels et les ressources documentaires du Cameroun.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="fr"><body>{children}</body></html>}
