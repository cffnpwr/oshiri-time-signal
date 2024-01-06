import server from "./server";
import { scheduled } from "./timeSignal";

export interface Env {
  MK_URL: string;
  MK_TOKEN: string;
  MK_HOOK_SECRET: string;
  OSHIRI_EMOJI: string;
  NO_OSIRI_EMOJI: string;
}

export default {
  scheduled,
  fetch: server.fetch,
};
