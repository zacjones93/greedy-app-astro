import { supabase } from "@lib/supabase";
import type { User } from "@supabase/supabase-js";
import { parse } from 'cookie';


export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return { data, error }
}

export const getUser = async (req: Request): Promise<{ user: User | null; accessToken: string; } | null> => {
  const cookies = parse(req.headers.get('cookie') || '')
  if (!cookies.access_token) return null
  const session = JSON.parse(cookies.session)
  const mySession = await supabase.auth.getUser(session.access_token)
  return {user: mySession.data.user, accessToken: session.access_token}
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
}