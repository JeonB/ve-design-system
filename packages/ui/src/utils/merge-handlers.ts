type EventHandler = ((event: never) => void) | undefined;

export function mergeHandlers<T extends EventHandler>(handlerA: T, handlerB: T): T {
  if (!handlerA) return handlerB;
  if (!handlerB) return handlerA;

  return ((event) => {
    handlerB(event);
    handlerA(event);
  }) as T;
}
