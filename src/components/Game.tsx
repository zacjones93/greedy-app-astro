import { useState, useReducer, useEffect } from "react";

type GameState = "Set up" | "inProgress" | "last round" | "complete";

const gameObject = {
	state: "inProgress",
	winner: "",
	scores: {
    "Zac": [0],
    "Mariah": [0],
    "Chrisy": [0],
    "Bill": [0],
    
  },
};

let initialInputState = Object.keys(gameObject.scores).reduce(
	(acc: any, player: any) => {
		acc[player] = "";
		return acc;
	},
	{}
);

const Game = () => {
	const [game, setGame] = useReducer((state: any, newState: any) => {
		switch (newState.type) {
			case "startGame":
				console.log("newState", newState);

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
					let currentScore = state.scores[player].slice(-1).pop();
					if (
						currentScore < 600 &&
						newState.scores[player].slice(-1).pop() < 600
					)
						return { ...state.scores };

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

	const gameScores = game.scores;
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
			let newScore =
				parseInt(currentScoreArray.slice(-1)) + parseInt(gameInput[player]);

			setGameInput({ [player]: "" });
			setGame({
				type: "addScore",
				scores: {
					[player]: [...currentScoreArray, newScore],
				},
			});

			console.log({ gameInput }, { [player]: 0 });
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

	let handleSetUpChange = (i, e) => {
		let newFormValues = [...setUpFormValues];
		newFormValues[i][e.target.name] = e.target.value;
		setSetUpFormValues(newFormValues);
	};

	let addSetUpFormFields = () => {
		setSetUpFormValues([...setUpFormValues, { name: "" }]);
	};

	let removeSetUpFormFields = (i) => {
		let newFormValues = [...setUpFormValues];
		newFormValues.splice(i, 1);
		setSetUpFormValues(newFormValues);
	};

	return (
		<div className="flex self-center justify-between h-full w-full gap-4 text-black">
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
						<div className="h-full w-full" key={playerScore}>
							<div className="mb-8 @container w-full">
                <div className="flex @xs:flex-wrap gap-2 border-b-2 w-full">
								<h2 className="text-xl shrink-0 self-center">{playerScore}</h2>
								<form onSubmit={handleSubmit} id={`${playerScore}-form`} className="w-full">
									<input
										className="w-full py-2 bg-gray-50 text-black rounded px-4 "
										placeholder={`enter score...`}
										id={playerScore}
										onChange={handleChange}
										value={gameInput[playerScore]}
										type="number"
									/>
								</form>
                </div>
								<ul className="space-y-4 ">
									{game.scores[playerScore].map((score: any) => {
										return <li className="text-xl">{score}</li>;
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
