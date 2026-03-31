import type { AuthUser } from "../context/AuthContext";
import type { BackendError } from "../types";

const BASE_URL = import.meta.env.VITE_API_URL;

let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export async function login(email: string, password: string) {
  // call login endpoint in backend
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // recieves the httpOnly refresh cookie
    body: JSON.stringify({ email, password }),
  });

  // parse response
  const result = await response.json();

  // return result
  if (!response.ok) {
    throw result as BackendError;
  }

  setAccessToken(result.accessToken);
  return {
    accessToken: result.accessToken as string,
    user: result.user as AuthUser,
  };
}

export async function refresh() {
  // call refresh endpoint in backend
  const response = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include", // sends the httpOnly refresh cookie
  });

  // parse response
  const result = await response.json();

  // return result
  if (!response.ok) {
    throw result as BackendError;
  }

  setAccessToken(result.accessToken);
  return {
    accessToken: result.accessToken as string,
    user: result.user as AuthUser,
  };
}

export async function logout() {
  setAccessToken(null);

  // call logout endpoint to delete refresh token from DB and clear cookie
  await fetch(`${BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include", // sends the httpOnly refresh cookie
  });
}

export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
  const doRequest = (token: string | null) =>
    fetch(input, {
      ...init,
      credentials: "include",
      headers: {
        ...init.headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

  // attempt to do request with current access token
  let response = await doRequest(getAccessToken());

  // if token expired
  if (response.status === 401) {
    try {
      // refresh token and try to do request with new token
      const { accessToken: newToken } = await refresh();
      response = await doRequest(newToken);
    } catch {
      logout();
      throw new Error("Unauthorized — please log in again");
    }
  }

  return response;
}
