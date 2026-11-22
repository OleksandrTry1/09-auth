import axios from "axios";

// Browser requests go through the local Next.js route handler so that
// authentication cookies belong to localhost and can be read by proxy.ts.
export const nextServer = axios.create({
  baseURL: "/api",
  withCredentials: true,
});
