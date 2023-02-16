import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setToken } from "../store/slices/auth";
import authService from "./authService";
import getEnvVariable from "../utils/getEnvVariable";

const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refresh-token");
  const refreshResponse = await authService.post("/refresh-token", {
    token: refreshToken,
  });
  const newToken = refreshResponse.data["token"];
  const newRefreshToken = refreshResponse.data["refresh_token"];
  const payload = refreshResponse.data["payload"];

  localStorage.setItem("refresh-token", newRefreshToken);
  return { token: newToken, refreshToken, newRefreshToken, payload: payload };
};

const baseQuery = fetchBaseQuery({
  baseUrl: getEnvVariable("VITE_CLEARANCE_SERVICE_URL"),
  prepareHeaders: (headers, { getState, extra }) => {
    const token = extra?.token || getState().auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const customFetchBaseQuery = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const { dispatch } = api;
    const newTokenDetails = await refreshToken();
    dispatch(setToken(newTokenDetails));

    result = await baseQuery(
      args,
      { ...api, extra: { token: newTokenDetails.token } },
      extraOptions
    );
  }

  return result;
};

export default customFetchBaseQuery;
