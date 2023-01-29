import { Block, BlockClass } from '$core';
import { Props } from '$core/Block';

interface NonChatProps extends Props {
  slot?: Block | BlockClass<Props>;
}

export default class NonChat extends Block<NonChatProps> {
  protected render(): string {
    return `
      <main class="center flex flex-column flex-x-center flex-center height-max-vh">
        {{{slot}}}
      </main>
    `;
  }
}
