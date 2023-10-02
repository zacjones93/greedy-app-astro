import CreateGame from "./create-game";
import GameInProgress from "./game-in-progress";

import { useStore } from "@nanostores/react";
import { game as gameStore } from "@lib/gameStore";


const Game = ({accessToken}: {accessToken: string}) => {
	const $gameRecord = useStore(gameStore)
  const gameId = Object.keys($gameRecord).slice(-1)[0]
  const game = $gameRecord[gameId]

	return (
		<div className="flex flex-wrap sm:flex-nowrap self-center justify-between h-full w-full gap-4 text-black">
			{!game && (
				<CreateGame />
			)}
			{game?.state === "inProgress" &&
        <GameInProgress />
      }
			{/* <div>State: {JSON.stringify(gameInput)}</div>
      <div>State: {JSON.stringify(game)}</div> */}
		</div>
	);
};

export default Game;
