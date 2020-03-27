import React from "react";
import { useAppState } from "../../state";
import { useHistory } from "react-router-dom";

function EnterEvent(props: any) {
  const { state, setState } = useAppState();
  const history = useHistory();
  const eventID = props.eventID;

  const enterEvent = async () => {
    try {
      const { uid } = state;
      const params = new window.URLSearchParams({ eventID, uid });
      const url = `${process.env.REACT_APP_API_BASE_URL}/enterEvent?${params}`;
      const response = await fetch(url, { method: "GET" });
      console.log(response);
      const data = await response.json();
      const userToken = data.userToken; // TODO save this to state
      if (userToken) setState({...state, userToken})
      history.push(`/room/${eventID}`);
    } catch (err) {
      console.log(err);
    }
  };


  const ticketState = () => {
    return <div onClick={enterEvent}>Enter Event</div>
  }

  return (
    <div className="enterEvent">
      {ticketState()}
    </div>
  );
}

export { EnterEvent };
