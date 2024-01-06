import { Temporal } from "@js-temporal/polyfill";

export interface Env {
  MK_URL: string;
  MK_TOKEN: string;
  OSHIRI_EMOJI: string;
  NO_OSIRI_EMOJI: string;
}

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    const date = Temporal.Instant.fromEpochMilliseconds(
      event.scheduledTime,
    ).toZonedDateTime({
      timeZone: "JST",
      calendar: "japanese",
    });
    const timeSignalStr =
      date.hour === 0
        ? env.NO_OSIRI_EMOJI || ":oshiriganaiyan:"
        : (env.OSHIRI_EMOJI || ":oshiri:").repeat(date.hour);

    const mkURL = new URL("/api/notes/create", env.MK_URL);

    ctx.waitUntil(fetch(mkURL.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        i: env.MK_TOKEN,
        text: timeSignalStr,
      }),
    }));
  },
};
