import { Block } from '$core';
import { Props } from '$core/Block';

export interface CardProps extends Props {
  slot?: Block;
}

export default class Card extends Block {
  protected render(): string {
    return `
      <div class="card container container-sm">
        {{{ slot }}}
      </div>
    `;
  }
}
