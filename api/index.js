const express = require("express");
const app = express();
const cors = require("cors");
const crypto = require("crypto");
const twilio = require("twilio");
require("dotenv").config();

var Airtable = require("airtable");
var base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

const MAX_ALLOWED_SESSION_DURATION = 14400;
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioApiKeySID = process.env.TWILIO_API_KEY_SID;
const twilioApiKeySecret = process.env.TWILIO_API_KEY_SECRET;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;

app.use(cors());

const client = new twilio(twilioAccountSid, twilioAuthToken);

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
  const {
    title,
    roomName,
    description,
    cost,
    participants,
    facilitator
  } = req.query;
  client.video.rooms.create({ uniqueName: "DailyStandup" }).then(room => {
    const roomSID = room.sid;
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
            roomName,
            roomSID
          }
        }
      ],
      function(err, records) {
        if (err) res.status(400).send(err);
        else res.status(200).send(records[0]._rawJson);
      }
    );
  });
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

app.get("/enterEvent", (req, res) => {
  const { uid, eventID } = req.query;
  const AccessToken = twilio.jwt.AccessToken;
  const VideoGrant = AccessToken.VideoGrant;
  // TODO: Check the user has a ticket for the room they are trying to enter
  const token = new AccessToken(
    twilioAccountSid,
    twilioApiKeySID,
    twilioApiKeySecret,
    {
      ttl: MAX_ALLOWED_SESSION_DURATION
    }
  );
  token.identity = uid;
  const videoGrant = new VideoGrant({ room: eventID });
  token.addGrant(videoGrant);
  const userToken = token.toJwt()
  res.status(200).send({ userToken });
});

app.listen(8081, () => console.log("token server running on 8081"));
