import React from "react";
import { useAppState } from "../../state/";
import { useHistory } from 'react-router-dom';

function TopNavigation() {
  const history = useHistory();
  const { state } = useAppState();

  const goToAddEvent = () => {
    history.push("/events/add-event");
  }
  const goToShowEvents = () => {
    history.push("/events/show-events");
  }
  



  return (
    <div className="TopNavigation">
      {state.id && (<div onClick={goToAddEvent}>Schedule an event</div>)}
      <div onClick={goToShowEvents}>Show events</div>
    </div>
  );
}

export { TopNavigation };
