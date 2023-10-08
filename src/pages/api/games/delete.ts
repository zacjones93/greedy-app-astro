
import {deleteGameById} from "@lib/database";
import type { APIRoute } from "astro";


export const DELETE: APIRoute = async ({redirect, request, cookies}) => { 
  let {gameId} = await request?.json()

  const {data, error} = gameId ? await deleteGameById(gameId) : { data: null, error: {
      message: "No game id provided"
    } }

  if (error) {
    return new Response(JSON.stringify({
      status: 500,
      data: error
    }))
  }

  return new Response(JSON.stringify({
    status: 200,
    data
  }))

}

