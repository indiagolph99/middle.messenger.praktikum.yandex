import { Block } from '$core';
import { Props } from '$core/Block';

export interface ButtonProps extends Props {
  text?: string;
  type?: Values<typeof Button.TYPES>;
  formId?: string;
}

export default class Button extends Block {
  static TYPES = {
    BASIC: '',
    GHOST: 'button--ghost',
    DANGER: 'button--danger',
  } as const;

  constructor(props: ButtonProps = {}) {
    super({ ...props });
  }

  protected render(): string {
    return `<button class="button {{{ type }}}" {{#if formId}} type="submit" form="{{formId}}"{{/if}}>
    <span class="flex flex-y-center">
      <span>{{ text }}</span>
    </span>
    </button>`;
  }
}
