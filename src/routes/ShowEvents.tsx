import React, { useState, useEffect } from "react";
import { useAppState } from "../state";
import { useHistory } from 'react-router-dom';

function ShowEvents() {
  const { state, setState } = useAppState();
  const history = useHistory();

  interface EventsInterface {
    _rawJson: {
      id: string;
      fields: {
        title: string;
        description: string;
        cost: number;
        eventParticipants: [];
      }
    }
  }

  const [events, setEvents] = useState<EventsInterface[]>();

  useEffect(() => {
    async function getEvents() {
      try {
        const url = `${process.env.REACT_APP_API_BASE_URL}/ShowEvents`;
        const response = await fetch(url, { method: "GET" });
        const data = await response.json();
        setEvents(data);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    }
    getEvents();
  }, []);

  const goToEvent = (event: React.MouseEvent) => {
    if (events) {
      const selectedEvent = events.find(i => {
        return i._rawJson.id === event.currentTarget.id
      });
      if (selectedEvent) setState({...state, selectedEvent: selectedEvent._rawJson.fields})
      history.push(`/events/${event.currentTarget.id}`);
    }
  }

  return (
    <div className="ShowEvents">
      <h1>Events</h1>
      {events && events.map(events => (
        <li key={events._rawJson.id} id={events._rawJson.id} onClick={goToEvent}>
          {events._rawJson.fields.title}, 
          {events._rawJson.fields.cost}, 
        </li>
      ))}
    </div>
  );
}

export { ShowEvents };
