import { Block } from '$core';
import { Props } from '$core/Block';

export interface InputProps extends Props {
  type?: Values<typeof Input.TYPES>;
  formId?: string;
  name: string;
  placeholder?: string;
  className?: Values<typeof Input.CLASS>;
  disabled?: boolean;
  inlineForm?: boolean;
}

export default class Input extends Block {
  static TYPES = {
    TEXT: 'text',
    EMAIL: 'email',
    PASSWORD: 'password',
    TEL: 'tel',
    FILE: 'file',
  } as const;

  static CLASS = {
    SEARCH: 'input-search',
    GHOST: 'input-ghost',
  } as const;

  constructor(props: InputProps) {
    const propsWithDefaults = {
      type: Input.TYPES.TEXT,
      placeholder: '',
      className: '',
      disabled: false,
      ...props,
    };

    super({ ...propsWithDefaults });

    this.setState({ error: '' });
  }

  protected render(): string {
    return `
      <div>
        <input type="{{ type }}" name="{{ name }}" placeholder="{{ placeholder }}"
        ${this.props.disabled ? 'disabled' : ''}
        ${this.props.formId ? 'form="{{ formId }}"' : ''}
        ${
          this.props.type === Input.TYPES.TEL
            ? 'pattern="[+]?[0-9]{10, 15}"'
            : ''
        }
        class="input {{{ className }}} ${
          this.props.inlineForm ? 'flex-grow-1' : ''
        }" />
      </div>
    `;
  }
}
