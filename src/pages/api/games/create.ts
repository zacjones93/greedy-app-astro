
import { createClient } from "@supabase/supabase-js";
import type { APIRoute } from "astro";


export const POST: APIRoute = async ({redirect, request, cookies}) => {

  
  const {id, type, scores, accessToken} = await request?.json()
  
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
    let {data, error} =  await supabase.from('games').insert([
      { id: String(id), type, scores, user_id: user.id, state: "inProgress" }
    ]).select()

    if (error?.code) {
      return new Response(JSON.stringify({
        status: 500,
        data: error.message
      }))
    }
    
    if (data) {
      return new Response(
        JSON.stringify(data[0].id), {
          status: 200,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }
  }
  
  return new Response(JSON.stringify({
    status: 500,
    data: "something went wrong"
  }))
}

