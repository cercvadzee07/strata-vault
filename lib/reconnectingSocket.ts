export type SocketStatus = "connecting" | "live" | "reconnecting";

interface Options {
  onMessage: (data: unknown) => void;
  onStatus?: (status: SocketStatus) => void;
}

/**
 * WebSocket, რომელიც კავშირის გაწყვეტისას თავად უერთდება თავიდან
 * (exponential backoff: 1წმ → 2წმ → 4წმ ... მაქს. 30წმ).
 * აბრუნებს ფუნქციას, რომელიც კავშირს სამუდამოდ ხურავს.
 */
export function openReconnectingSocket(
  url: string,
  { onMessage, onStatus }: Options,
) {
  let ws: WebSocket | null = null;
  let retryDelay = 1000;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;
  let closed = false;

  const connect = () => {
    if (closed) return;
    ws = new WebSocket(url);

    ws.onopen = () => {
      retryDelay = 1000;
      onStatus?.("live");
    };

    ws.onmessage = (event) => {
      try {
        onMessage(JSON.parse(event.data));
      } catch (err) {
        console.error("WS parse error", err);
      }
    };

    ws.onclose = () => {
      if (closed) return;
      onStatus?.("reconnecting");
      retryTimer = setTimeout(connect, retryDelay);
      retryDelay = Math.min(retryDelay * 2, 30000);
    };

    // error-ს ყოველთვის მოსდევს close, reconnect იქ ხდება
    ws.onerror = () => ws?.close();
  };

  onStatus?.("connecting");
  connect();

  return () => {
    closed = true;
    if (retryTimer) clearTimeout(retryTimer);
    ws?.close();
  };
}
