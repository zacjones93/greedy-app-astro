import { useState, useReducer, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import cx from "classnames";

import { useStore } from "@nanostores/react";
import { addScore, editScore as editStoreScore, game as gameStore } from "@lib/gameStore";

const GameInProgress = () => {
  const $gameRecord = useStore(gameStore)
  const gameId = Object.keys($gameRecord).slice(-1)[0]
  const game = $gameRecord[gameId]

  let [editScore, setEditScore] = useState<{score: number | ""; indexToEdit: number | null; player: string;}>({score: "", indexToEdit: null, player: ""})
  let [playerColumn, setPlayerColumn] = useState<string>("")

  const [gameInput, setGameInput] = useReducer(
		(state: any, newState: any): any => ({ ...state, ...newState }),
		{}
	);

	const gameScores = game?.scores;
  const displayScores = Object.keys(gameScores).reduce((prevPlayers: any, currPlayer: any) => {
    let tempAggregator = 0
    let newScores = gameScores[currPlayer].map((score: number, i: number, array: number[]) => {
      if(i === 0) return score

      tempAggregator += array[i - 1]

      return score + tempAggregator
    })

    return {
      ...prevPlayers,
      [currPlayer]: newScores 
    }
  }, {})
  const currentPlayerScores: any = Object.keys(displayScores).reduce((prev, curr) => {
    return {
      ...prev,
      [curr]: displayScores[curr].slice(-1).pop()
    }
  }, {})
	const players = Object.keys(game.scores);
	// useEffect(() => {
	//   console.log("game scores", gameScores)
	//   players.map((player: any) => {
	//     let currentScore = gameScores[player].slice(-1).pop()

	//     if (currentScore >= 10000)
	//   })
	// }
	// , [game])

	const handleSubmit = (e: any) => {
		e.preventDefault();

		let newScoresFromRound = Object.keys(gameInput).filter(
			(inputKey: any) => !!gameInput[inputKey]
		);

		newScoresFromRound.forEach((player: any) => {
			let currentScoreArray = game.scores[player];
			let newScore = parseInt(gameInput[player])
				

			setGameInput({ [player]: "" });
      addScore(gameId, {[player]: [...currentScoreArray, newScore]})
		});
	};

  const handleEditScore = (
    {score, indexToEdit, player}: 
    {score: number; indexToEdit: number; player: string}) => {
      editStoreScore({gameId, score, indexToEdit, player})
  }

	const handleChange = (e: any) => {
		const id = e.target.id;
		const newValue = e.target.value;

		if (newValue >= 0) setGameInput({ [id]: parseInt(newValue) });
	};
  
  return (
    <div className="h-full w-full max-w-sm flex gap-2">
      {/* <div>State: {JSON.stringify(editScore)}</div>
      <div>State: {JSON.stringify(playerColumn)}</div> */}
      {Object.keys(game.scores).map((playerScore: any) => {
        return (
          <div className="" key={playerScore}>
            
            <div className="mb-2 sm:mb-8 w-full">
              <div className=" border-b-2 w-full">
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <h2 className="text-3xl sm:text-xl text-center">{playerScore}</h2>
                    <div className="relative self-center group cursor-pointer sm:cursor-default ">
                      <DetailIcon className=" sm:hidden h-5 w-5"/>
                      <div className=" left-12 opacity-0 group-hover:opacity-100 select-none sm:group-hover:opacity-0 duration-300 absolute inset-0 z-10 flex justify-center items-center text-xs text-black font-semibold bg-opacity-50 rounded bg-white">score details</div>
                    </div>
                </div>
                <p className="text-3xl sm:text-lg text-center md:hidden">{currentPlayerScores[playerScore]}</p>
              </div>
              <form onSubmit={handleSubmit} id={`${playerScore}-form`} className="mt-4 w-full">
                <input
                  className="w-full py-2 bg-gray-50 text-black rounded px-4 "
                  placeholder={`enter score...`}
                  id={playerScore}
                  onChange={handleChange}
                  value={gameInput[playerScore] || ""}
                  type="number"
                  step={50}
                />
              </form>
              </div>
              <ul className="flex-col md:flex hidden mt-4">
                {game.scores[playerScore].map((score: number, i: number) => {
                  let currentScore = displayScores[playerScore][i]
                  return (
                    <li className="relative text-lg w-fit self-end flex " key={`${playerScore}-${score}-${i}`}
                      onClick={() => {
                        
                        setPlayerColumn(`${playerScore}-${score}-${i}`)
                      }}
                    >
                      <div
                        key={`${playerScore}-${score}-${i}-edit`}
                        className={cx("h-8 text-gray-500 font-mono font-bold text-xs self-center px-2 py-1 rounded mr-8 cursor-pointer hover:bg-gray-200", {
                          "hidden": score === 0,
                        })}
                        onClick={(e) => {
                          console.log(e.currentTarget.getAttribute('id'));
                          setEditScore({score, indexToEdit: i, player: playerScore})
                        }}
                      >+{score}</div>
                      <div className={cx("absolute -left-[5.5rem] flex flex-row gap-2", {
                            "hidden": playerColumn !== `${playerScore}-${score}-${i}`,
                          })}>
                        <div className=" flex gap-1">
                          <button type="submit"
                            className={cx("h-8 w-8 text-center bg-green-200 text-black rounded border-2 border-gray-500 ", {
                              "hidden": editScore.indexToEdit !== i,
                            })}
                            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                              e.preventDefault()
                              handleEditScore({score: editScore.score as number, indexToEdit: editScore.indexToEdit as number, player: playerScore})
                              setEditScore({score: "", indexToEdit: null, player: playerScore})
                            }}
                            >&#10003;</button>
                          <button type="submit"
                            className={cx("h-8 w-8 text-center bg-red-200 text-black rounded border-2 border-gray-500", {
                              "hidden": editScore.indexToEdit !== i,
                            })}
                            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                              e.preventDefault()
                              setEditScore({score: "", indexToEdit: null, player: ""})
                              setPlayerColumn("")
                            }}
                            >x</button>
                        </div>
                        <input 
                          type="number"
                          className={cx(" w-24 h-8 text-center bg-gray-50 text-black rounded py-2 px-4 border-2 border-gray-500", {
                            "hidden": editScore.indexToEdit !== i,
                          }) }
                          value={editScore.score as number}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditScore({score: parseInt(e.target.value), indexToEdit: i, player: playerScore})}
                          onSubmit={(e: React.FormEvent<HTMLInputElement>) => {
                            e.preventDefault()
                            handleEditScore({score: editScore.score as number, indexToEdit: editScore.indexToEdit as number, player: ""})
                          }}
                          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                            if (e.key === "Enter") {
                              handleEditScore({score: editScore.score as number, indexToEdit: editScore.indexToEdit as number, player: playerScore})
                              setEditScore({score: "", indexToEdit: null, player: ""})
                            }
                          }}
                          step={50}
                        />
                      </div>
                      
                      <div
                        className={cx(" w-16 cursor-default", {
                          "hidden": currentScore === 0,
                        })
                        }
                      >
                        <div className="w-fit float-right">
                          {currentScore}
                        </div>
                      </div>
                    </li>);
                })}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  )
}

const DetailIcon = ({className}: {className: string}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.0} stroke="currentColor" className={twMerge("w-4 h-4", className)}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
)

export default GameInProgress