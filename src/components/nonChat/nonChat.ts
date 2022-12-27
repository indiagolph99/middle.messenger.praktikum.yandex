import { Block } from '$core';

export default class NonChat extends Block {
  constructor(slot: Block) {
    super({ slot });
  }

  protected render(): string {
    return `
      <main class="center flex flex-column flex-x-center flex-center height-max-vh">
        {{{slot}}}
      </main>
    `;
  }
}
