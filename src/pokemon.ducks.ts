import { Dispatch } from "react";
import { useThunkReducer } from "./reducer-thunk";

// ACTIONS
type FetchPokemonPending = {
  type: "FETCH_POKEMON_PENDING";
};

type FetchPokemonCompleted = {
  type: "FETCH_POKEMON_COMPLETED";
  pokemons: Pokemon[];
};

type FetchPokemonFailed = {
  type: "FETCH_POKEMON_FAILED";
};

type PokemonAction =
  | FetchPokemonPending
  | FetchPokemonCompleted
  | FetchPokemonFailed;

// INITIAL STATE & TYPE DEFINITION
type Pokemon = {
  name: string;
  url: string;
};

type PokemonState = {
  pokemons: Pokemon[];
  isLoading: boolean;
};

const initialState: PokemonState = {
  pokemons: [],
  isLoading: false
};

// REDUCER
function reducer(state: PokemonState, action: PokemonAction): PokemonState {
  switch (action.type) {
    case "FETCH_POKEMON_PENDING":
      return { ...state, isLoading: true };
    case "FETCH_POKEMON_COMPLETED":
      return { ...state, isLoading: false, pokemons: action.pokemons };
    case "FETCH_POKEMON_FAILED":
      return { ...state, isLoading: false, pokemons: [] };
  }
}

// ACTION CREATORS
export const fetchPokemons = () => {
  return async (dispatch: Dispatch<PokemonAction>) => {
    dispatch({ type: "FETCH_POKEMON_PENDING" });

    try {
      const result: { results: Pokemon[] } = await (await fetch(
        "https://pokeapi.co/api/v2/pokemon"
      )).json();

      dispatch({ type: "FETCH_POKEMON_COMPLETED", pokemons: result.results });
    } catch {
      dispatch({ type: "FETCH_POKEMON_FAILED" });
    }
  };
};

// FINALY EXPOSE THE REDUCER
export const usePokemonReducer = () =>
  useThunkReducer(reducer, initialState, "pokemons");
