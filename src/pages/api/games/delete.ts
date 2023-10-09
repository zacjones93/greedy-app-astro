
import { createClient } from "@supabase/supabase-js";
import type { APIRoute } from "astro";


export const DELETE: APIRoute = async ({redirect, request, cookies}) => { 
  let {gameId, accessToken} = await request?.json()

  const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL, 
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY, {global: { headers: {
      Authorization: `Bearer ${accessToken}`
  }}})
  const {
    data: { user },
  } = await supabase.auth.getUser(accessToken);

  if (user) {
    const { data, error } = await supabase
    .from('games')
    .delete()
    .eq('id', gameId)
        
    if (error) {
      return new Response(JSON.stringify({
        data: error.message
      }), {status: 500})
    }
    
    return new Response(JSON.stringify({
      data
    }), {status: 200})
  }

  return new Response(JSON.stringify({
    data: "user not found"
  }), {status: 500})
}

