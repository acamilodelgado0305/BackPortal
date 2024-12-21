import { v4 as uuidv4 } from "uuid";
import {
  CreateMeetingCommand,
  CreateAttendeeCommand,
} from "@aws-sdk/client-chime-sdk-meetings";
import chimeClient from "../awsconfig/chimeClient.js";

const meetings = {};

// Crear una reunión
export const createMeeting = async (req, res) => {
  try {
    const meetingResponse = await chimeClient.send(
      new CreateMeetingCommand({
        ClientRequestToken: uuidv4(),
      })
    );

    const meetingId = meetingResponse.Meeting.MeetingId;
    meetings[meetingId] = meetingResponse.Meeting;

    res.json(meetingResponse.Meeting);
  } catch (error) {
    console.error("Error creating meeting:", error);
    res.status(500).send("Error creating meeting");
  }
};

// Unirse a una reunión
export const joinMeeting = async (req, res) => {
  try {
    const { meetingId, userName } = req.body;

    if (!meetings[meetingId]) {
      return res.status(404).send("Meeting not found");
    }

    const attendeeResponse = await chimeClient.send(
      new CreateAttendeeCommand({
        MeetingId: meetingId,
        ExternalUserId: `user-${uuidv4()}`,
      })
    );

    res.json({
      Meeting: meetings[meetingId],
      Attendee: attendeeResponse.Attendee,
      UserName: userName,
    });
  } catch (error) {
    console.error("Error joining meeting:", error);
    res.status(500).send("Error joining meeting");
  }
};
