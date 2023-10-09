import { supabase } from "./supabase"

export const saveGameById = async (gameId: string, scores: any) => {
  const { data, error } = await supabase
  .from('games')
  .update({scores})
  .eq('id', gameId)
  
  return {data, error}
}

export const deleteGameById = async (gameId: string) => {
  const { data, error } = await supabase
  .from('games')
  .delete()
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