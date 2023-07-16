import type { APIRoute } from "astro"
import { supabase } from "@lib/supabase"

export const get: APIRoute = async ({ params, request }) => {
  //const accessToken = Astro.cookies.get("access_token")
  const parsedAccessToken = JSON.parse(accessToken.value || "{}")
  if(parsedAccessToken) {
    const session = await supabase.auth.getUser(parsedAccessToken)
    return session.data.user
  }
  
  return {
    body: JSON.stringify({
      message: "This was a GET!"
    })
  }
};