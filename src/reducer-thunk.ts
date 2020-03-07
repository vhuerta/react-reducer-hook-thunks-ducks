import { useCallback, Reducer, ReducerState, ReducerAction } from "react";
import { useReducer } from "reinspect";

export type StateGetter<A extends Reducer<any, any>> = () => ReducerState<A>;
export type DispatchThunk<A extends Reducer<any, any>> = (
  dispatch: (value: ReducerAction<A>) => void,
  state: StateGetter<A>
) => void;
export type DispatcherThunk<A extends Reducer<any, any>> = (
  action: ReducerAction<A> | DispatchThunk<A>
) => void;
export type ActionOrThunk<A extends Reducer<any, any>> =
  | ReducerAction<A>
  | DispatchThunk<A>;

/**
 * Augments React's useReducer() hook so that the action
 * dispatcher supports thunks.
 */
export function useThunkReducer<R extends Reducer<any, any>>(
  reducer: R,
  initialState: ReducerState<R>,
  id: string
): [ReducerState<R>, DispatcherThunk<R>] {
  const [state, dispatch] = useReducer(
    reducer,
    initialState,
    state => state,
    id
  );

  const getState = useCallback(() => state, [state]);

  const dispatchThunk = (action: ActionOrThunk<R>): void => {
    return typeof action === "function"
      // @ts-ignore
      ? action(dispatch, getState)
      : dispatch(action);
  };

  return [state, dispatchThunk];
}
