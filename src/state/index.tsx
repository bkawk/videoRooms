import React, { createContext, useContext, useState } from 'react';

interface StateContextType {
    state: {
        userToken: string;
        id: string;
        authState: boolean;
        uid: string;
        displayName: string;
        photoURL: string;
        selectedEvent: {
            title: string;
            description: string;
            cost: string;
            eventParticipants: string[];
        };
    }
    setState(state: object): void;
}

const StateContext = createContext<StateContextType>(null!);
const savedState = localStorage.getItem('state');
let initialState: {};
if (savedState) initialState = JSON.parse(savedState);
else initialState = {authState: false}

function AppStateProvider(props: React.PropsWithChildren<{}>) {
    const [state, setState] = useState<object>(initialState);
    localStorage.setItem('state', JSON.stringify(state))
    const contextValue = { state, setState } as StateContextType;
    return <StateContext.Provider value={{ ...contextValue }}>{props.children}</StateContext.Provider>;
}

function useAppState() {
  const context = useContext(StateContext);
  return context;
}

export { AppStateProvider, useAppState }