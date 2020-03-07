import * as React from "react";
import "./styles.css";
import { usePokemonReducer, fetchPokemons } from "./pokemon.ducks";

export default function App() {
  const [state, dispatch] = usePokemonReducer();

  function handleOnClick() {
    dispatch(fetchPokemons());
  }

  return (
    <div className="App">
      <h1>Hello Reducer Thunks and Ducks!</h1>
      <button onClick={handleOnClick} disabled={state.isLoading}>
        {state.isLoading ? "Fetching pokemons..." : "Fetch pokemons"}
      </button>

      <ul style={{ listStyle: "none" }}>
        {state.pokemons.map(pokemon => (
          <li key={pokemon.name}>
            <a href={pokemon.url}>{pokemon.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
