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

const gameObject = {
	state: "inProgress",
	winner: "",
	scores: {
    zac: [0],
    mariah: [0],
    bill: [0],
    chrisy: [0],
  },
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

const Game = () => {
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
  console.log({displayScores})
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

	const handleChange = (evt: any) => {
		const id = evt.target.id;
		const newValue = evt.target.value;

		if (newValue > 0) setGameInput({ [id]: parseInt(newValue) });
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
				<div className="flex flex-col justify-between h-full gap-4">
					<h2 className="text-2xl">Add how many players you'd like to keep track of 👇</h2>
					<form onSubmit={handleCreationSubmit} className="w-fit mx-auto" id="setup-form">
						<div className="mb-4 space-x-4 w-fit mx-auto">
							<button
								className="px-4 border-2 rounded border-gray-500 hover:text-blue-500 hover:border-blue-500"
								type="button"
								onClick={() => addSetUpFormFields()}
							>
								Add
							</button>
							<button
								className="bg-blue-500 px-4 rounded text-white"
								type="submit"
							>
								Submit
							</button>
						</div>
						{setUpFormValues.map((element, index) => (
							<div className="flex flex-row gap-2 mt-2 relative " key={index}>
								<label className="self-center shrink-0">Player {index + 1}</label>
								<input
									type="text"
									name="name"
                  className="w-full bg-gray-50 text-black rounded py-2 px-4 border-2 border-gray-500"
									value={element.name || ""}
									onChange={(e) => handleSetUpChange(index, e)}
								/>

								{index ? (
									<button
										type="button"
										className="absolute -right-[6.5rem] py-2 px-4 border-2 rounded border-gray-500 hover:text-red-500 hover:border-red-500"
										onClick={() => removeSetUpFormFields(index)}
									>
										Remove
									</button>
								) : null}
							</div>
						))}
					</form>
				</div>
			)}
			{game.state === "inProgress" &&
				Object.keys(game.scores).map((playerScore: any) => {
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
								<ul className="flex-col md:flex hidden">
									{game.scores[playerScore].map((score: number, i: number) => {
                    let currentScore = displayScores[playerScore][i]
										return (
                      <li className="text-lg w-fit self-end flex " key={`${playerScore}-${score}-${i}`}>
                        <div
                          className={cx(" text-gray-500 font-bold text-xs self-center mr-8", {
                            "hidden": score === 0,
                          })}
                        >+{score}</div>
                        <div
                          className={cx(" w-16", {
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
			{/* <div>State: {JSON.stringify(gameInput)}</div>
      <div>State: {JSON.stringify(game)}</div> */}
		</div>
	);
};

export default Game;
