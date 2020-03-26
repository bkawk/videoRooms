import React from "react";
import { useAppState } from "../../state";
import { useHistory } from "react-router-dom";
import { FacebookLogin } from "../facebookLogin";

function BuyTicket(props: any) {
  const { state } = useAppState();
  const history = useHistory();
  const eventID = props.eventID;

  const buyTicket = async () => {
    try {
      const id = state.id;
      const params = new window.URLSearchParams({ eventID, id });
      const url = `${process.env.REACT_APP_API_BASE_URL}/BuyTicket?${params}`;
      const response = await fetch(url, { method: "POST" });
      const data = await response.json();
      history.push(`/events/show-events`);
    } catch (err) {
      console.log(err);
    }
  };

  const haveTicketAlready = () => {
    const parts = state.selectedEvent.eventParticipants;
    if (parts) return parts.includes(state.id);
    else return false
  }

  const ticketState = () => {
    if (!state.id) return <FacebookLogin/>
    else if (haveTicketAlready()) return <div>You have a ticket already!</div>
    else return <div onClick={buyTicket}>Buy a Ticket</div>
  }

  return (
    <div className="BuyTicket">
      {ticketState()}
    </div>
  );
}

export { BuyTicket };
