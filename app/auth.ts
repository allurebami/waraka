import {auth, currentUser} from '@clerk/nextjs/server';

export async function getWarakaUser() {
  const {userId}=await auth();
  if(!userId)return null;
  const user=await currentUser();
  if(!user)return null;
  const email=user.primaryEmailAddress?.emailAddress||'';
  return {userId, email, displayName:user.fullName||email};
}
