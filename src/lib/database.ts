import { supabase } from "./supabase"

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