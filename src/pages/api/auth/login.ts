
import { supabase } from "@lib/supabase";
import type { APIRoute } from "astro"


export const POST: APIRoute = async ({redirect, request, cookies}) => {
  let body = await request.json();

  const {error, data} = await supabase.auth.setSession({
      access_token: body.access_token as string,
      refresh_token: body.refresh_token as string
    })
  const {session, user} = data

  if (error) return redirect("/login")

  if (session) cookies.set("session", JSON.stringify(session), { path: "/"})
  if (user) cookies.set("user", JSON.stringify(user), { path: "/"})
  if (session?.access_token) cookies.set("access_token", session.access_token, { path: "/"})

  return redirect("/games", 302)
}
