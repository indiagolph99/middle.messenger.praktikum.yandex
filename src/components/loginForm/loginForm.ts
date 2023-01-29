import { AuthForm } from '$components';
import { Block } from '$core';
import { FormItemProps } from '$components/formItem';
import {
  ALNU_HYPHEN_UNDERSCORE,
  ALPHA_REQUIRED,
  CAPITAL_REQUIRED,
  DIGIT_REQUIRED,
} from '$utils/regexps';
import { AuthController } from '$controllers';
import { LoginRequest } from '$api/types';

class LoginForm extends Block<Record<string, unknown>> {
  public static componentName = 'Login';

  private controller: AuthController;

  constructor() {
    const itemsConfig = [
      { inputProps: { name: 'login', placeholder: 'Login' } },
      {
        inputProps: {
          name: 'password',
          type: 'password',
          placeholder: 'Password',
        },
      },
    ] as FormItemProps[];

    const rules = {
      login: [
        {
          required: true,
          min: 3,
          max: 20,
          pattern: ALNU_HYPHEN_UNDERSCORE.pattern,
          message: ALNU_HYPHEN_UNDERSCORE.message,
        },
        {
          pattern: ALPHA_REQUIRED.pattern,
          message: ALPHA_REQUIRED.message,
        },
      ],
      password: [
        {
          required: true,
          min: 8,
          max: 40,
          pattern: CAPITAL_REQUIRED.pattern,
          message: CAPITAL_REQUIRED.message,
        },
        {
          pattern: DIGIT_REQUIRED.pattern,
          message: DIGIT_REQUIRED.message,
        },
      ],
    };

    const authForm = new AuthForm(
      {
        title: 'Login',
        linkTitle: 'Sign up',
        linkHref: '/signup',
        formConfig: {
          itemsConfig,
          formId: 'login',
          buttonConfig: { text: 'Log in' },
        },
      },
      rules,
    );
    super({ authForm, error: '' });
    this.controller = new AuthController();
    this.setProps({
      events: {
        submit: (event: SubmitEvent) => {
          this.setProps({ error: '' });
          const formData = new FormData(event.target as HTMLFormElement);
          const formDataObj = Object.fromEntries(formData.entries());
          this.controller
            .login(formDataObj as unknown as LoginRequest)
            .catch(() =>
              this.refs.authform.setProps({ error: 'Something went wrong' }),
            );
        },
      },
    });
  }

  protected render(): string {
    return `
      <main class="center flex flex-column flex-x-center flex-center height-max-vh">
        {{{ authForm }}}
      </main>
    `;
  }
}

export default LoginForm;
