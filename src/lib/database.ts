import { getUser } from "./auth"
import { supabase } from "./supabase"


export const createGameinDatabase = async ({id, type, scores, accessToken}: {id: string, type: string, scores: any, accessToken: string}) => {
  
  const {
    data: { user },
  } = await supabase.auth.getUser(accessToken);

  if (user) {
    let {data, error} =  await supabase.from('games').insert([
      { id: String(id), type, scores, user_id: user.id, state: "inProgress" }
    ]).select()

    return {data, error}
  }
  
  return {data: null, error: "No user"}
}

export const saveGameById = async (gameId: string, scores: any) => {
  const { data, error } = await supabase
  .from('games')
  .update({scores})
  .eq('id', gameId)
  
  return {data, error}
}

export const getAllGamesByUser = async (userId: string) => {
  const { data, error } = await supabase
  .from('games')
  .select('*')
  .eq('user_id', userId)
  
  return {data, error}
}

export const getGameById = async (gameId: string) => {
  const { data, error } = await supabase
  .from('games')
  .select('*')
  .eq('id', gameId)
  
  return {data, error}
}