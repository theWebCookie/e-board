import { useState } from 'react';

type SetStateAction<S> = S | ((prevState: S) => S);

interface UseHistoryReturn<S> {
  state: S;
  setState: (action: SetStateAction<S>, overwrite?: boolean) => void;
  undo: () => void;
  redo: () => void;
}

const useHistory = <S>(initialState: S): UseHistoryReturn<S> => {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState([initialState]);

  const setState = (action: SetStateAction<S>, overwrite = false) => {
    const newState = typeof action === 'function' ? (action as (prevState: S) => S)(history[index]) : action;

    if (overwrite) {
      const historyCopy = [...history];
      historyCopy[index] = newState;
      setHistory(historyCopy);
    } else {
      const updatedState = [...history].slice(0, index + 1);
      setHistory([...updatedState, newState]);
      setIndex((prevState) => prevState + 1);
    }
  };

  const undo = () => index > 0 && setIndex((prevState) => prevState - 1);
  const redo = () => index < history.length - 1 && setIndex((prevState) => prevState + 1);

  return { state: history[index], setState, undo, redo };
};

export default useHistory;
