type EventHandler = ((event: never) => void) | undefined;

/** asChild 모드에서 Button props와 자식 엘리먼트의 동일 이벤트 핸들러를 순차 호출한다. */
export function mergeHandlers<T extends EventHandler>(handlerA: T, handlerB: T): T {
  if (!handlerA) return handlerB;
  if (!handlerB) return handlerA;

  return ((event) => {
    handlerB(event);
    handlerA(event);
  }) as T;
}
