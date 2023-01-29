import { Block } from '$core';
import { Props } from '$core/Block';
import { Link } from '$components/link';
import { Form, FormProps } from '$components/form';
import { ValidationRule } from '$utils/validator';

export interface AuthFormProps extends Props {
  formConfig: FormProps;
  title: string;
  linkTitle: string;
  linkHref: string;
  error?: string;
}

export default class AuthForm extends Block {
  constructor(props: AuthFormProps, rules: Record<string, ValidationRule[]>) {
    const form = new Form(props.formConfig, rules);
    const link = new Link({ path: props.linkHref, text: props.linkTitle });
    super({ form, ...props, ref: 'authform', link });
  }

  protected render(): string {
    return `
      <div class="card container container-sm">
        <div class="box center flex flex-x-center flex-column text-center">
          <h3 class="text--medium mb-s2">{{ title }}</h3>
          {{{ form }}}
          <div class="mt-s1">
          {{{ link }}}
          </div>
        </div>
        {{#if error}}
          <div class="background--brand-secondary-danger mb-s1 pa-s1 text--brand-danger">
            {{ error }}
          </div>
        {{/if}}
      </div>
    `;
  }
}
