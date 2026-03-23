import { WebSocketService } from './websocket.service';

describe('WebSocketService', () => {
  it('should emit event with payload', () => {
    const service = new WebSocketService();
    const emit = jest.fn();
    // @ts-expect-error - test double for socket server
    service.server = { emit };

    service.emitEvent('order:new', { id: 1 }, 99);

    expect(emit).toHaveBeenCalledWith('order:new', {
      data: { id: 1 },
      userId: 99,
    });
  });
});
