import { Block } from '$core';
import { Props } from '$core/Block';

interface FormItemErrorProps extends Props {
  error: string;
}

export default class FormItemError extends Block<FormItemErrorProps> {
  setError(error: string) {
    this.setProps({ error });
  }

  protected render(): string {
    return `
      <div class="error text--small text--brand-danger">{{ error }}</div>
    `;
  }
}
