import { default as helloTile, DEFAULT } from '../helloTile';

describe('HelloTile Reducer', () => {
  it('returns default state when no action passed', () => {
    const nextState = helloTile(undefined, {});
    expect(nextState).toEqual(DEFAULT);
  });

  it('toggles the HelloTile state when action TOGGLE_HELLO_TILE passed', () => {
    const nextState = helloTile(DEFAULT, { type: 'TOGGLE_HELLO_TILE' });
    expect(nextState.hide).toBe(true);
  });
});
