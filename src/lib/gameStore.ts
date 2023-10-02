import { atom, map } from 'nanostores';
import { toast } from 'react-hot-toast';
import {v4}  from 'uuid';

export type GameState = "setUp" | "inProgress" | "complete";
export type GameType = "greedy" | "farkle" | "10 crowns";
export type GameObject = { state: GameState; scores: any; winner: string; gameType: string; players: string[] | never[]; }

const gameObject = {
	state: "setUp",
	winner: "",
  gameType: "greedy",
	scores: {
  },
  players: []
};

let initialInputState = Object.keys(gameObject.scores).reduce(
	(acc: any, player: any) => {
		acc[player] = "";
		return acc;
	},
	{}
);

export const game = map<Record<string, GameObject>>({});
//! initialize with this game state to test game
/*
{
    "29c77bcf-2a3d-4184-be8c-eb630616558e": {
        "state": "inProgress",
        "winner": "",
        "gameType": "greedy",
        "scores": {
            "zac": [
                0,
                600,
                800,
                1000
            ],
            "mariah": [
                0,
                600,
                800,
                1000
            ]
        },
        "players": []
    }
}
*/

export const createGame = (setUpFormValues: any) => {
  let scores = setUpFormValues
    .filter((player: any) => !!player?.name)
    .reduce((acc: any, player: any) => {
      acc[player.name] = [0];
      return acc;
    }, {});

    const id = v4();

    game.setKey(id, {
      ...gameObject,
			state: "inProgress",
			scores
		});
}

export const addScore = (gameId: string, scores: {[key: string]: number[]}) => {
  let playersToCheck = Object.keys(scores);
  let currentGame = game.get()[gameId];

  playersToCheck.map((player: string) => {
    let newScore = scores[player].slice(-1).pop()
    if (newScore && newScore % 50 !== 0) {
      toast.error("Score must be a multiple of 50")
    } else if (
      newScore && newScore < 600 
      && currentGame.scores[player].length === 1
    ){
      toast.error("Initial score must be at least 600")
    } else {
      game.setKey(gameId, {
        ...currentGame,
        scores: {
          ...currentGame.scores,
          [player]: [...currentGame.scores[player], newScore]
        }
      })
    }
  })
}

export const editScore = ({gameId, score, indexToEdit, player}: {gameId: string, score: number, indexToEdit: number, player: string }) => {
  let currentGame = game.get()[gameId]
  let playerScores = currentGame.scores[player]
  let editedScores = [
    ...playerScores.slice(0, indexToEdit),
    score,
    ...playerScores.slice(indexToEdit + 1)
  ]

  game.setKey(gameId, {
    ...currentGame,
    scores: {
      ...currentGame.scores,
      [player]: editedScores
    }
  })
}