import React from "react";
import { useAppState } from "../../state";
import { RemoteParticipant } from "twilio-video";

function Participant(data: any) {
  const { state, setState } = useAppState();
  console.log(data)

  return (
    <div className="participant">
        1
        <video></video>
        <audio></audio>
    </div>
  );
}

export { Participant };
