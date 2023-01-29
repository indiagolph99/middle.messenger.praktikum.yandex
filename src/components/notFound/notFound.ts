import { Error, Link } from '$components';
import { Block } from '$core';

export default class NotFound extends Block {
  static componentName = 'Not found';

  constructor() {
    const notFound = new Error({ code: 404, message: 'Nothing to be found' });
    const link = new Link({ text: 'Back to chats', path: '/chats' });
    super({ notFound, link });
  }

  protected render(): string {
    return `
      <main class="center flex flex-column flex-x-center flex-center height-max-vh">
        {{{ notFound }}}
        {{{link}}}
      </main>
    `;
  }
}
