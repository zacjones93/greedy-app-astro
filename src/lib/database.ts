import { getUser } from "./auth"
import { supabase } from "./supabase"


export const createGameinDatabase = async ({id, gameType, scores, accessToken}: {id: string, gameType: string, scores: any, accessToken: string}) => {
  
  const {
    data: { user },
  } = await supabase.auth.getUser(accessToken);

  console.log({user})

  if (user) {
    await supabase.from('games').insert([
      { id: String(id), type: gameType, scores, user_id: user.id, state: "inProgress" }
    ])
  }
  
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