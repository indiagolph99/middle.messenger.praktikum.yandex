import { SocketMessage } from '$api/types';

export default function createSocket(
  userId: string,
  chatId: string,
  token: string,
) {
  let intervalId = 0;
  const socket = new WebSocket(
    `wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`,
  );

  socket.addEventListener('open', () => {
    intervalId = setInterval(
      () => socket.send(JSON.stringify({ type: 'ping' })),
      10_000,
    ) as unknown as number;
    socket.send(JSON.stringify({ content: '0', type: 'get old' }));
  });

  socket.addEventListener('close', () => {
    clearInterval(intervalId);
  });

  socket.addEventListener('message', (event) => {
    try {
      const msg = JSON.parse(event.data as string) as
        | SocketMessage
        | SocketMessage[];

      if (Array.isArray(msg)) {
        window.store.dispatch({ messages: msg });
      } else if (msg.type === 'message') {
        socket.send(JSON.stringify({ type: 'get old', content: '0' }));
      }
    } catch {
      socket.close(1003, 'Failed to parse the socket event data');
    }
  });

  socket.addEventListener('error', (event) => {
    console.log('Error', event);
  });

  return socket;
}
