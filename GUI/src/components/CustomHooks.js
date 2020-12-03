import {useCallback, useState} from "react";

export function useStateWithEvent(initialState, attribute='value') {
    const [state, setState] = useState(initialState);
    const setStateFromEvent = useCallback(
        (event) => {
            setState(event.target[attribute]);
        }, [setState, attribute]
    );
    return [state, setStateFromEvent];
}
