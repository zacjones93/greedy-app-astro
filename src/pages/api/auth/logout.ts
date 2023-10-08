
import { supabase } from "@lib/supabase"
import type { APIRoute } from "astro"

export const POST: APIRoute = async ({redirect, request, cookies}) => { 
  const {error} = await supabase.auth.signOut()

  if (error) {
    return new Response(JSON.stringify({
      status: 500,
      data: error
    }))
  }

  return redirect("/login", 302)
}

