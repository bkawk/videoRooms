const express = require("express");
const app = express();
const cors = require("cors");
const crypto = require("crypto");
const AccessToken = require("twilio").jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
require("dotenv").config();

var Airtable = require("airtable");
var base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

const MAX_ALLOWED_SESSION_DURATION = 14400;
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioApiKeySID = process.env.TWILIO_API_KEY_SID;
const twilioApiKeySecret = process.env.TWILIO_API_KEY_SECRET;

app.use(cors());

app.post("/facilitators", (req, res) => {
  const { name } = req.query;
  base("facilitators").create([{ fields: { name } }], (err, records) => {
    if (err) res.status(400).send(err);
    else res.status(200).send(records[0]._rawJson);
  });
});

app.post("/updateUser", (req, res) => {
  const { uid, displayName, email, photoURL, provider } = req.query;
  base("users")
    .select({ filterByFormula: `(uid='${uid}')` })
    .eachPage(
      (page = records => {
        if (records.length > 0) {
          const id = records[0]._rawJson.id;
          base("users").update(
            [
              {
                id,
                fields: { displayName, email, photoURL, provider }
              }
            ],
            function(err, records) {
              if (err) res.status(400).send(err);
              else res.status(200).send(records[0]._rawJson);
            }
          );
        } else {
          base("users").create(
            [{ fields: { uid, displayName, email, photoURL, provider } }],
            function(err, records) {
              if (err) res.status(400).send(err);
              else res.status(200).send(records[0]._rawJson);
            }
          );
        }
      })
    );
});

app.post("/addEvent", (req, res) => {
  const eventId = crypto.randomBytes(20).toString("hex");
  console.log(eventId);
  const { title, description, cost, participants, facilitator } = req.query;
  base("events").create(
    [
      {
        fields: {
          title,
          eventId,
          start: "2020-03-18T10:27:00.000Z",
          end: "2020-03-25T10:27:00.000Z",
          lockAfter: 600,
          enterBeforeFacilitator: true,
          cost: +cost,
          description,
          eventParticipants: [],
          facilitator: [facilitator],
          room: []
        }
      }
    ],
    function(err, records) {
      if (err) res.status(400).send(err);
      else res.status(200).send(records[0]._rawJson);
    }
  );
});

app.post("/BuyTicket", (req, res) => {
  const { eventID, id } = req.query;
  base("events").find(eventID, function(err, record) {
    if (err) res.status(400).send(err);
    if (record) {
      const eventParticipants = record._rawJson.fields.eventParticipants || [];
      eventParticipants.push(id);
      base("events").update(
        [
          {
            id: eventID,
            fields: {
              eventParticipants
            }
          }
        ],
        function(err) {
          if (err) res.status(400).send(err);
          else res.status(200).send(record._rawJson);
        }
      );
    }
  });
});

app.get("/showEvents", (req, res) => {
  base("events")
    .select({
      view: "Grid view"
    })
    .firstPage(function(err, records) {
      if (err) res.status(400).send(err);
      else res.status(200).send(records);
    });
});

app.get("/Event", (req, res) => {
  console.log(req.query);
  const eventID = req.query.eventID;
  base("events").find(eventID, function(err, record) {
    if (err) res.status(400).send(err);
    else res.status(200).send(record._rawJson);
  });
});

app.get("/token", (req, res) => {
  const { identity, roomName } = req.query;
  const token = new AccessToken(
    twilioAccountSid,
    twilioApiKeySID,
    twilioApiKeySecret,
    {
      ttl: MAX_ALLOWED_SESSION_DURATION
    }
  );
  token.identity = identity;
  const videoGrant = new VideoGrant({ room: roomName });
  token.addGrant(videoGrant);
  res.send(token.toJwt());
  console.log(`issued token for ${identity} in room ${roomName}`);
});

app.listen(8081, () => console.log("token server running on 8081"));
