import { Block } from '$core';
import { Props } from '$core/Block';
import { FormItem, FormItemProps } from '$components/formItem';
import { Button, ButtonProps } from '$components/button';
import { Validator, ValidationRule } from '$utils/validator';

export interface FormProps extends Props {
  itemsConfig: FormItemProps[];
  formId: string;
  inlineForm?: boolean;
  buttonConfig: ButtonProps;
}

export default class Form extends Block<FormProps> {
  private validator: Validator;

  constructor(props: FormProps, rules: Record<string, ValidationRule[]>) {
    const propsWithDefaults: FormProps = {
      inlineForm: false,
      ...props,
      events: {
        submit: (event: SubmitEvent) => {
          event.preventDefault();
          this.validator.onSubmit(event);
        },
      },
    };

    const submitButton = new Button({
      ...props.buttonConfig,
      formId: props.formId,
    });

    const ids = props.itemsConfig.map((config) => {
      const input = new FormItem({ ref: config.inputProps.name, ...config });
      propsWithDefaults[input.id] = input;
      return `{{{ ${input.id} }}}`;
    });

    super({ ...propsWithDefaults, submitButton });
    this.setState({ inputIds: ids.join(' ') });
    this.validator = new Validator(
      rules,
      this.refs as Record<string, FormItem>,
    );
  }

  protected render(): string {
    return `
      <form class="text-center {{#if inlineForm}}flex flex-grow-1{{/if}}"  id="{{ formId }}">
        <fieldset {{#if inlineForm}}class="flex flex-grow-1"{{/if}}>
          ${this.state.inputIds as string}
        </fieldset>
        {{{ submitButton }}}
      </form>
    `;
  }
}
