import React, { useState, useEffect } from "react";
import { useAppState } from "../state";
import { useHistory } from "react-router-dom";
import { BuyTicket } from "../components/buyTicket";

function Event(props: any) {
  const eventID = props.match.params.eventID;
  const { state, setState } = useAppState();
  const history = useHistory();

  useEffect(() => {
    const getEvents = async () => {
      try {
        const params = new window.URLSearchParams({ eventID });
        const url = `${process.env.REACT_APP_API_BASE_URL}/Event?${params}`;
        const response = await fetch(url, { method: "GET" });
        const selectedEvent = await response.json();
        setState({...state, selectedEvent: selectedEvent.fields})
      } catch (err) {
        console.log(err);
      }
    }
    if (!state.selectedEvent) getEvents();
  }, []);


  return (
    <div className="Event">
      <h1>Event</h1>
      {state.selectedEvent && 
      <p>{state.selectedEvent.title} <br/> {state.selectedEvent.description} <BuyTicket eventID={eventID}/></p>
      }
    </div>
  );
}

export { Event };
