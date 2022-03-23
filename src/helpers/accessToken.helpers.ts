import { decode } from "jsonwebtoken";
import { UserInformation } from "../api/userInformation";

export const getUserInformationByAccessToken = (
  accessToken: string
): UserInformation => {
  const accessTokenDecoded = decode(accessToken, { json: true });

  return {
    username: accessTokenDecoded.sub,
  };
};

export const getUserNameByAccessToken = (accessToken: string) => {
  return getUserInformationByAccessToken(accessToken).username;
};
