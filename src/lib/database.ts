import { createClient } from "@supabase/supabase-js";


export const getAllGamesByUser = async (userId: string, accessToken: string) => {

  const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL, 
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY, {global: { headers: {
      Authorization: `Bearer ${accessToken}`
  }}})
  const { data, error } = await supabase
  .from('games')
  .select('*')
  .eq('user_id', userId)
  
  return {data, error}
}

export const getGameById = async (gameId: string, accessToken: string) => {

  const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL, 
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY, {global: { headers: {
      Authorization: `Bearer ${accessToken}`
  }}})

  const { data, error } = await supabase
  .from('games')
  .select('*')
  .eq('id', gameId)
  
  return {data, error}
}