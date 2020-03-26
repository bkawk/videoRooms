import React, { useState } from "react";
import { useAppState } from "../state";
import { useHistory } from "react-router-dom";

function AddEvent() {
  const { state } = useAppState();
  const history = useHistory();

  const [form, setForm] = useState({
    title: 'a',
    description: 'b',
    cost: '0.00',
    participants: '10',
  });

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { title, description, cost, participants } = form;
    try {
      const facilitator = state.id;
      const params = new window.URLSearchParams({ title, description, cost, participants, facilitator });
      const url = `${process.env.REACT_APP_API_BASE_URL}/addEvent?${params}`;
      const response = await fetch(url, {method: 'POST'});
      const data = await response.json();
      history.push(`/events/show-events`);
      } catch (err) {
        console.log(err)
      }
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement >) => {
    event.persist();
    const { id, value } = event.target;
    setForm((prev: any) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="AddEvent">
        <h1>Add event</h1>
        <form onSubmit={onSubmit}>
          <label>Title
            <input type="text" id="title" value={form.title} onChange={onChange}/>
          </label>
          <br/>
          <label>Description
          <textarea id="description" cols={40} rows={5} value={form.description} onChange={onChange}></textarea>
          </label>
          <br/>
          <label>Cost
            <input type="number" id="cost" value={form.cost} onChange={onChange}/>
          </label>
          <br/>
          <label>Participants
            <input type="number" id="participants" value={form.participants} onChange={onChange}/>
          </label>
          <br/>
          <input type="submit" value="Add Event"/>
        </form>
    </div>
  );
}

export { AddEvent };
