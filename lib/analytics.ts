type EventPayload = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function track(event: string, payload: EventPayload = {}) {
  if (typeof window === "undefined") return;
  if (window.dataLayer) {
    window.dataLayer.push({ event, ...payload });
  } else {
    // Fallback for development
    // eslint-disable-next-line no-console
    console.log("analytics", event, payload);
  }
}
