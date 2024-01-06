import { Temporal } from "@js-temporal/polyfill";
import { Env } from ".";

export const scheduled = async (
  event: ScheduledEvent,
  env: Env,
  ctx: ExecutionContext,
) => {
  const tmp = Temporal.Instant.fromEpochMilliseconds(event.scheduledTime)
    .toZonedDateTime({
      timeZone: "JST",
      calendar: "japanese",
    })
    .add({ minutes: 1 });
  const date = Temporal.ZonedDateTime.from({
    year: tmp.year,
    month: tmp.month,
    day: tmp.day,
    hour: tmp.hour,
    minute: tmp.minute,
    second: 0,
    millisecond: 0,
    timeZone: "JST",
    calendar: "japanese",
  });
  const timeSignalStr =
    date.hour === 0
      ? env.NO_OSIRI_EMOJI || ":oshiriganaiyan:"
      : (env.OSHIRI_EMOJI || ":oshiri:").repeat(date.hour);

  const mkURL = new URL("/api/notes/create", env.MK_URL);
  const timeNow = Temporal.Now.plainDateTime("japanese", "JST");
  const duration = timeNow
    .until(date.toPlainDateTime())
    .total({ unit: "millisecond" });
  console.log("duration: ", duration);

  await new Promise((resolve) => {
    setTimeout(resolve, duration);
  });

  await fetch(mkURL.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      i: env.MK_TOKEN,
      text: timeSignalStr,
    }),
  });
};
