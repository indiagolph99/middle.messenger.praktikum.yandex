import { Block } from '$core';
import { Props } from '$core/Block';
import { Form, FormProps } from '$components/form';
import { ValidationRule } from '$utils/validator';

export interface AuthFormProps extends Props {
  formConfig: FormProps;
  title: string;
  linkTitle: string;
  linkHref: string;
}

export default class AuthForm extends Block {
  constructor(props: AuthFormProps, rules: Record<string, ValidationRule[]>) {
    const form = new Form(props.formConfig, rules);
    super({ form, ...props });
  }

  protected render(): string {
    return `
      <div class="card container container-sm">
        <div class="box center flex flex-x-center flex-column text-center">
          <h3 class="text--medium mb-s2">{{ title }}</h3>
          {{{ form }}}
          <div class="mt-s1">
              <a href="{{linkHref}}">{{ linkTitle }}</a>
          </div>
        </div>
      </div>
    `;
  }
}
