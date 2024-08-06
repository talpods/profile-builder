import axios from "axios";
import { config } from "../config/config.js";

export const validateToken = async (token, refreshToken) => {
  try {
    // Make the request to the validate endpoint
    const response = await axios.get(config.validateLink, {
      headers: {
        authorization: token,
        refreshtoken: refreshToken,
      },
    });

    // Handle the response
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Token validation failed");
    }
  } catch (error) {
    // Handle specific error cases
    if (error.response && error.response.status === 401) {
      throw new Error("Unauthorized: Token is not valid or not provided");
    } else {
      throw new Error("Error validating token: " + error.message);
    }
  }
};
