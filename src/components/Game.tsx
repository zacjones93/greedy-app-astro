import { useState, useReducer, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { twMerge } from "tailwind-merge";
import cx from "classnames";
type GameState = "Set up" | "inProgress" | "last round" | "complete";

/*
!TODO:
  - refactor to store score added each round, resulting score as derived state
  - edit each round score
*/
type GameObject = {
  state: string;
  winner: string;
  scores: {
    [key: string]: number[];
  };
  // players: string[];
};

const gameObject = {
	state: "inProgress",
	winner: "",
	scores: {
    zac: [600, 1000, 2000],
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

let DetailIcon = ({className}: {className: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.0} stroke="currentColor" className={twMerge("w-4 h-4", className)}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
)

const GameInProgress = ({game, handleSubmit, handleChange, gameInput, currentPlayerScores, displayScores, handleEditScore}: { game: GameObject;
  handleSubmit:  (e: any) => void;
  handleChange:  (e: any) => void;
  gameInput: any;
  currentPlayerScores: any;
  displayScores: any;
  handleEditScore: ({score, indexToEdit, player}: 
    {score: number; indexToEdit: number; player: string}) => void;
}) => {
  let [editScore, setEditScore] = useState<{score: number | ""; indexToEdit: number | null}>({score: "", indexToEdit: null})

  
  return (
    <div>
      {Object.keys(game.scores).map((playerScore: any) => {
        return (
          <div className="h-full w-full max-w-sm" key={playerScore}>
            <div className="mb-2 sm:mb-8 w-full">
              <div className="gap-2 border-b-2 w-full">
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
                    <li className="text-lg w-fit self-end flex " key={`${playerScore}-${score}-${i}`}>
                      <div
                        className={cx("h-8 text-gray-500 font-mono font-bold text-xs self-center px-2 py-1 rounded mr-8 cursor-pointer hover:bg-gray-200", {
                          "hidden": score === 0 || editScore.indexToEdit === i,
                        })}
                        onClick={() => setEditScore({score, indexToEdit: i})}
                      >+{score}</div>
                      <div className="relative">
                        <div className="absolute -left-[4.5rem] flex gap-1">
                          <button type="submit"
                            className={cx("h-8 w-8 text-center bg-green-200 text-black rounded border-2 border-gray-500 ", {
                              "hidden": editScore.indexToEdit !== i,
                            })}
                            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                              e.preventDefault()
                              handleEditScore({score: editScore.score as number, indexToEdit: editScore.indexToEdit as number, player: playerScore})
                              setEditScore({score: "", indexToEdit: null})
                            }}
                            >&#10003;</button>
                          <button type="submit"
                            className={cx("h-8 w-8 text-center bg-red-200 text-black rounded border-2 border-gray-500", {
                              "hidden": editScore.indexToEdit !== i,
                            })}
                            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                              e.preventDefault()
                              setEditScore({score: "", indexToEdit: null})
                            }}
                            >x</button>
                        </div>
                        <input 
                          type="number"
                          className={cx(" w-24 h-8 text-center bg-gray-50 text-black rounded py-2 px-4 border-2 border-gray-500", {
                            "hidden": editScore.indexToEdit !== i,
                          })}
                          value={editScore.score as number}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditScore({score: parseInt(e.target.value), indexToEdit: i})}
                          onSubmit={(e: React.FormEvent<HTMLInputElement>) => {
                            e.preventDefault()
                            handleEditScore({score: editScore.score as number, indexToEdit: editScore.indexToEdit as number, player: playerScore})
                          }}
                          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                            if (e.key === "Enter") {
                              handleEditScore({score: editScore.score as number, indexToEdit: editScore.indexToEdit as number, player: playerScore})
                              setEditScore({score: "", indexToEdit: null})
                            }
                          }}
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

const Game = ({accessToken}: {accessToken: string}) => {
	const [game, setGame] = useReducer((state: any, newState: any) => {
		switch (newState.type) {
			case "startGame":

				let scores = newState.setUpFormValues
					.filter((player: any) => !!player?.name)
					.reduce((acc: any, player: any) => {
						acc[player.name] = [0];
						return acc;
					}, {});

				return { ...state, state: "inProgress", scores };
			case "addScore":
				let playersToCheck = Object.keys(newState.scores);

				let newScores = playersToCheck.map((player: any) => {
					let currentScore = state.scores[player].slice(-1).pop()
          let newScore = newState.scores[player].slice(-1).pop()

          if (newScore % 50 !== 0) {
            toast.error("Score must be a multiple of 50")
            return { ...state.scores }
          };

					if (
						newScore < 600 &&
						state.scores[player].length === 1
					){
            toast.error("Initial score must be at least 600")
						return { ...state.scores };}

					return { ...state.scores, ...newState.scores };
				});

				return { ...state, scores: newScores.pop() };
      case "editScore":
        let {score, indexToEdit, player} = newState
        let playerScores = state.scores[player]
        let editedScores = [
          ...playerScores.slice(0, indexToEdit),
          score,
          ...playerScores.slice(indexToEdit + 1)
        ]

        return { ...state, scores: {...state.scores, [player]: editedScores}}

			default:
				return state;
		}
	}, gameObject);
	const [gameInput, setGameInput] = useReducer(
		(state: any, newState: any): any => ({ ...state, ...newState }),
		initialInputState
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
			setGame({
				type: "addScore",
				scores: {
					[player]: [...currentScoreArray, newScore],
				},
			});
		});
	};

  const handleEditScore = (
    {score, indexToEdit, player}: 
    {score: number; indexToEdit: number; player: string}) => {
    setGame({
      type: "editScore",
      score,
      indexToEdit,
      player
    })
  }

	const handleChange = (e: any) => {
		const id = e.target.id;
		const newValue = e.target.value;

		if (newValue >= 0) setGameInput({ [id]: parseInt(newValue) });
	};

	const [setUpFormValues, setSetUpFormValues] = useState([{ name: "" }]);

	const handleCreationSubmit = (e: any) => {
		e.preventDefault();

		setGame({ type: "startGame", setUpFormValues });
	};

	let handleSetUpChange = (i: any, e: any) => {
		let newFormValues: any = [...setUpFormValues];
		newFormValues[i][e.target.name] = e.target.value
		setSetUpFormValues(newFormValues);
	};

	let addSetUpFormFields = () => {
		setSetUpFormValues([...setUpFormValues, { name: "" }]);
	};

	let removeSetUpFormFields = (i: any) => {
		let newFormValues = [...setUpFormValues];
		newFormValues.splice(i, 1);
		setSetUpFormValues(newFormValues);
	};

	return (
		<div className="flex flex-wrap sm:flex-nowrap self-center justify-between h-full w-full gap-4 text-black">
      <Toaster />
			{game.state === "Set up" && (
				<div className="flex flex-col justify-between w-full h-full gap-4 mx-auto">
					<h2 className="text-2xl text-center">Add how many players you'd like to keep track of 👇</h2>
					<form onSubmit={handleCreationSubmit} className="flex flex-wrap sm:flex-wrap-0 justify-evenly" id="setup-form">
						<div className="mb-4 flex flex-col gap-4">
							<button
								className="px-20 py-4 border-2 rounded border-gray-500 hover:text-blue-500 hover:border-blue-500"
								type="button"
								onClick={() => addSetUpFormFields()}
							>
								Add
							</button>
							<button
								className="bg-blue-500 px-20 py-4  rounded text-white ml-0 hover:opacity-80"
								type="submit"
							>
								Submit
							</button>
						</div>
            <div className="flex flex-col">
						{setUpFormValues.map((element, index) => (
							<div className="flex flex-col sm:flex-row gap-2 mt-2 relative " key={index}>
								<label className="self-center shrink-0">Player {index + 1}</label>
								<input
									type="text"
									name="name"
                  className="w-full h-fit self-center bg-gray-50 text-black rounded py-2 px-4 border-2 border-gray-500"
									value={element.name || ""}
									onChange={(e) => handleSetUpChange(index, e)}
								/>

								{index ? (
									<button
										type="button"
										className="absolute -right-[6.5rem] top-8 sm:top-0  py-2 px-4 border-2 rounded border-gray-500 hover:text-red-500 hover:border-red-500"
										onClick={() => removeSetUpFormFields(index)}
									>
										Remove
									</button>
								) : null}
							</div>
						))}
            </div>
					</form>
				</div>
			)}
			{game.state === "inProgress" &&
        <GameInProgress
          game={game}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          gameInput={gameInput}
          currentPlayerScores={currentPlayerScores}
          displayScores={displayScores}
          handleEditScore={handleEditScore}
        />
      }
			{/* <div>State: {JSON.stringify(gameInput)}</div>
      <div>State: {JSON.stringify(game)}</div> */}
		</div>
	);
};

export default Game;
