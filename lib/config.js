// Public catalogue settings retained from WARAKA's existing configuration.
// Only a Supabase publishable/anon key belongs here; never a service-role key.
export const supabaseConfig = {
  url: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fzzlqqxsujenuksftrdk.supabase.co',
  publishableKey: process.env.SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_Nc1ofmT78vbXQ94kwQm5Gw_3clWTsbb',
};

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://waraka-bea6.vercel.app').replace(/\/$/, '');
export const WHATSAPP_NUMBER = '237657806397';
export const contactUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Bonjour Waraka, j'ai une question au sujet des produits ou des praticiens référencés.")}`;
export const serviceUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Bonjour WARAKA, je souhaite recevoir une offre pour améliorer les photos et la visibilité de mes produits.')}`;
