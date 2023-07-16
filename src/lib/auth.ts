import { supabase } from "@lib/supabase";


export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return { data, error }
}

export const getUser = async (req: Request) => {
  let user = await fetch('/api/auth/user', {
    method: 'GET',
    headers: new Headers({ 'Content-Type': 'application/json'}),
  })

  console.log("from fetch",user)

}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
}