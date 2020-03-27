import React, { useState, useEffect } from "react";
import { useAppState } from "../state";
import { connect, LocalParticipant, RemoteParticipant } from "twilio-video";
import { Participant } from "../components/participant";

function Room(props: any) {
  const eventID = props.match.params.eventID;
  const { state } = useAppState();
  const userToken = state.userToken;

  const [particpants, setParticpants] = useState<RemoteParticipant[]>([]);

  useEffect(() => {
    connect(userToken, { name: eventID }).then(
      room => {
        room.participants.forEach(participantConnected);
        room.on("participantConnected", participantConnected);
        room.on("participantDisconnected", participantDisconnected);
        room.once("disconnected", error => {
          room.participants.forEach(participantDisconnected);
        });
      },
      error => {
        console.error(`Unable to connect to Room: ${error.message}`);
      }
    );
  }, []);

  const participantConnected = (participant: RemoteParticipant) => {
    if (particpants.indexOf(participant) === -1) {
      setParticpants([...particpants, participant]);
    }
  };

  const participantDisconnected = (participant: RemoteParticipant) => {
    console.log(participant);
    // if the participant is in the `particpants array remove them
  };

  const renderPartipants = () => {
      const arr:JSX.Element[] = [];
      particpants.forEach(function (participant, index) {
        arr.push(<Participant data={participant} key={index}/>);
    });
      return arr;
  }

  return (
    <div className="Room">
      <h1>Room</h1>
      {renderPartipants()}
    </div>
  );
}

export { Room };
