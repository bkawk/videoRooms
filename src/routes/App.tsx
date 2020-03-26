import React from "react";
import { useAppState } from "../state";
import { FacebookLogin } from "../components/facebookLogin";
import { TopNavigation } from "../components/topNavigation";

function App() {
  const { state, setState } = useAppState();

  return (
    <div className="App">
      <h1>Home</h1>
      <p>{state.displayName}</p>
      <img src={state.photoURL}/>
      <TopNavigation />
      <FacebookLogin />
    </div>
  );
}

export { App };
