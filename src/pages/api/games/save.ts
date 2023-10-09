
import { createClient } from "@supabase/supabase-js";
import type { APIRoute } from "astro";


export const PUT: APIRoute = async ({redirect, request, cookies}) => {
  const {gameId, scores, accessToken} = await request?.json()
  if (!accessToken) {
    return new Response(JSON.stringify({
      status: 400,
      message: "No access token provided"
    }))
  }
   
  //https://github.com/supabase/gotrue-js/pull/340#issuecomment-1218065610
  const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL, 
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY, {global: { headers: {
      Authorization: `Bearer ${accessToken}`
  }}})

  const {
    data: { user },
  } = await supabase.auth.getUser(accessToken);

  if (user) {
    const { error } = await supabase.from('games').update({scores}).eq('id', gameId)

    if (error?.code) {
      return new Response(JSON.stringify({
        data: error.message
      }), {status: 400})
    } else {
      return new Response(null, {status: 200})
    }

  }
  
  return new Response(null, {status: 500})
}

