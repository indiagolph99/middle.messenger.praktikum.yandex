import { Block } from '$core';
import { ChatAside, ChatMain } from '$components';

export default class Main extends Block {
  constructor() {
    const aside = new ChatAside();
    const main = new ChatMain();
    super({ aside, main });
  }

  protected render(): string {
    return `
    <main class="messenger">
      <div class="sidebar">
        {{{ aside }}}
        {{{ main }}}
      </div>
    </main>
    `;
  }
}
