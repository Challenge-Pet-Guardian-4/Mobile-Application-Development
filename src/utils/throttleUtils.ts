/**
 * Utilitário para controle de concorrência e throttle de requisições de warm-up/ping.
 * Garante deduplicação com promessa única em voo (single-flight) e cooldown entre disparos.
 */
export function createThrottledPing(
  action: () => Promise<unknown>,
  cooldownMs = 10 * 60 * 1000
): () => Promise<boolean> {
  let inFlight: Promise<boolean> | null = null;
  let lastTimestamp = 0;

  return async (): Promise<boolean> => {
    const now = Date.now();

    if (now - lastTimestamp < cooldownMs) {
      return true;
    }

    if (inFlight) {
      return inFlight;
    }

    inFlight = (async () => {
      try {
        await action();
        lastTimestamp = Date.now();
        return true;
      } catch {
        return false;
      } finally {
        inFlight = null;
      }
    })();

    return inFlight;
  };
}
