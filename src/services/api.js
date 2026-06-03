import axios from "axios";

const BASE_URL = "http://4.224.186.213/evaluation-service";

const authData = {
  "email": "aryankamboj25@gmail.com",
  "name": "aryan kumar",
  "rollNo": "2330700",
  "accessCode": "nwwsKx",
  "clientID": "339c65fb-21be-45af-a942-fbd366b72a7d",
  "clientSecret": "BbQhddaGAxSVbCqE"
};

export const getNotifications = async () => {
  try {
    // Get Token
    const authResponse = await axios.post(
      `${BASE_URL}/auth`,
      authData
    );

    const token = authResponse.data.access_token;

    // Get Notifications
    const notificationResponse = await axios.get(
      `${BASE_URL}/notifications`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return notificationResponse.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};