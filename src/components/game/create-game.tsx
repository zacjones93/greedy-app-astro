import { createGame } from "@lib/gameStore";
import { useState } from "react";

const CreateGame = ({accessToken}: 
{
  accessToken: string
}) => {
  const [setUpFormValues, setSetUpFormValues] = useState([{ name: "" }]);

  const handleCreationSubmit = async (e: any) => {
    e.preventDefault();
    const {data, error} = await createGame(setUpFormValues, accessToken)
    const gameSlug = data ? data[0].id : null
    
    if (gameSlug) {
      document.location.assign(`/games/${gameSlug}`)
    }
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
  <div className="flex flex-col justify-between w-full h-full gap-4 max-w-3xl mx-auto">
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
      <div id="dynamic-fields" className="flex flex-col">
      {setUpFormValues.map((element, index) => (
        <div  className="flex flex-col sm:flex-row gap-2 mt-2 relative " key={index}>
          <label className="self-center shrink-0">Player {index + 1}</label>
          <input
            type="text"
            name="name"
            className="w-full h-fit self-center bg-gray-50 text-black rounded py-2 px-4 border-2 border-gray-500"
            value={element.name || ""}
            onChange={(e) => handleSetUpChange(index, e)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === "Tab" && index === setUpFormValues.length - 1) {
                addSetUpFormFields()
              }
            }}
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
  </div>)
}

export default CreateGame;