import { Block } from '$core';
import { Props } from '$core/Block';
import { Input, InputProps } from '$components/input';
import { FormItemError } from '$components/formItemError';

export interface FormItemProps extends Props {
  inputProps: InputProps;
  hideError?: boolean;
  error?: string;
}

export default class FormItem extends Block {
  constructor(props: FormItemProps) {
    const propsWithDefaults = {
      hideError: false,
      error: '',
      ...props,
      inlineForm: props.inputProps.inlineForm,
      ref: props.inputProps.name,
    };

    const input = new Input(props.inputProps);
    const errorItem = new FormItemError({
      error: propsWithDefaults.error,
      ref: 'error',
    });

    super({ ...propsWithDefaults, input, errorItem });
  }

  setError(error: string) {
    this.refs.error.setProps({ error });
  }

  protected render(): string {
    return `
      <div class="${this.props.inlineForm ? 'flex-grow-1' : ''}">
        {{{ input }}}
        {{#unless hideError}}
          {{{ errorItem }}}
        {{/unless}}
      </div>
    `;
  }
}
