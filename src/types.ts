import type { entities as MisskeyEntities } from "misskey-js";

type WebhookTypes = {
  user: "follow" | "followed" | "unfollow";
  note: "note" | "reply" | "renote" | "mention";
};

export type MisskeyWebhook<T = WebhookTypes["user" | "note"]> = {
  hookId: string;
  userId: string;
  eventId: string;
  createdAt: string;
  type: T;
  body: T extends WebhookTypes["user"]
    ? {
        user: MisskeyEntities.User;
      }
    : T extends WebhookTypes["note"]
      ? {
          note: MisskeyEntities.Note;
        }
      : null;
};

export const WebhookTypeCheck = <T extends WebhookTypes["user" | "note"]>(
  type: T,
  json: MisskeyWebhook,
): json is MisskeyWebhook<T> => json.type === type;
