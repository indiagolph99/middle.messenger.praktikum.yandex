import { Block } from '$core';
import { Button, Form, Link } from '$components';
import AuthController from '$controllers/authController';
import { FormItemProps } from '$components/formItem';
import { Avatar } from '$components/avatar';
import {
  ALNU_HYPHEN_UNDERSCORE,
  ALPHA_REQUIRED,
  CAPITAL_REQUIRED,
  CAPITALIZED,
  DIGIT_REQUIRED,
  EMAIL,
  LATIN_AND_CYRILLIC,
  ONLY_DIGITS,
} from '$utils/regexps';
import UserController from '$controllers/userController';
import { Props } from '$core/Block';
import transformUser from '$utils/apiTransformers';
import { APP_PROXY } from '$utils/fetch';

interface InfoProps extends Props {
  avatar?: Avatar;
  logOutButton?: Button;
  form?: Form;
  error?: string;
  success?: string;
}

export default class Info extends Block<InfoProps> {
  static componentName = 'Settings';

  userController: UserController;

  constructor() {
    const itemsConfig = [
      {
        inputProps: {
          name: 'email',
          type: 'email',
          placeholder: 'Email',
          id: 'profile_email',
        },
      },
      {
        inputProps: {
          name: 'login',
          placeholder: 'Login',
          id: 'profile_login',
        },
      },
      {
        inputProps: {
          name: 'display_name',
          placeholder: 'Display name',
          id: 'profile_display_name',
        },
      },
      {
        inputProps: {
          name: 'first_name',
          placeholder: 'First name',
          id: 'profile_first_name',
        },
      },
      {
        inputProps: {
          name: 'second_name',
          placeholder: 'Last name',
          id: 'profile_second_name',
        },
      },
      {
        inputProps: {
          name: 'phone',
          type: 'tel',
          placeholder: 'Phone',
          id: 'profile_phone',
        },
      },
      {
        inputProps: {
          name: 'password',
          type: 'password',
          placeholder: 'Old password',
        },
      },
      {
        inputProps: {
          name: 'repeat_password',
          type: 'password',
          placeholder: 'New password',
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
      display_name: [
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
      repeat_password: [
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
      email: [
        {
          required: true,
          pattern: EMAIL.pattern,
          message: EMAIL.message,
        },
      ],
      first_name: [
        {
          required: true,
          pattern: LATIN_AND_CYRILLIC.pattern,
          message: LATIN_AND_CYRILLIC.message,
        },
        {
          pattern: CAPITALIZED.pattern,
          message: CAPITALIZED.message,
        },
      ],
      second_name: [
        {
          required: true,
          pattern: LATIN_AND_CYRILLIC.pattern,
          message: LATIN_AND_CYRILLIC.message,
        },
        {
          pattern: CAPITALIZED.pattern,
          message: CAPITALIZED.message,
        },
      ],
      phone: [
        {
          required: true,
          min: 10,
          max: 15,
          pattern: ONLY_DIGITS.pattern,
          message: ONLY_DIGITS.message,
        },
      ],
    };
    const form = new Form(
      {
        itemsConfig,
        formId: 'profile',
        buttonConfig: { text: 'Save' },
        noAutoComplete: true,
      },
      rules,
    );
    const avatar = new Avatar({ url: '#', formId: 'profile' });
    const link = new Link({ path: '/chats', text: 'Back to chats' });

    const logOutButton = new Button({
      type: Button.TYPES.DANGER,
      text: 'Log out',
      events: {
        click: (event: Event) => {
          event.preventDefault();
          const controller = new AuthController();
          this.setProps({ error: '' });
          controller
            .logout()
            .catch(() => this.setProps({ error: 'Something went wrong' }));
        },
      },
    });
    super({
      form,
      avatar,
      logOutButton,
      link,
    });
    this.userController = new UserController();

    this.setProps({
      events: {
        submit: (event: SubmitEvent) => {
          this.setProps({ error: '', success: '' });
          const formData = new FormData(event.target as HTMLFormElement);
          return this.userController
            .updateUser(formData)
            .then((response) => {
              window.store.dispatch({ user: transformUser(response[0]) });
              this.setProps({ success: 'Saved' });
            })
            .catch(() => {
              this.setProps({ error: 'Something went wrong' });
            });
        },
      },
    });
  }

  componentDidMount() {
    return this.fillData();
  }

  fillData() {
    const { user } = window.store.getState();
    const mapFields = {
      email: '#profile_email',
      login: '#profile_login',
      displayName: '#profile_display_name',
      firstName: '#profile_first_name',
      secondName: '#profile_second_name',
      phone: '#profile_phone',
    };

    Object.entries(mapFields).forEach(([key, value]) => {
      const el = document.querySelector(value) as HTMLInputElement;

      if (el !== null && user !== null) {
        el.value = user[key as keyof User] as string;
      }
    });

    if (user && user.avatar) {
      this.children.avatar.setProps({
        url: `${APP_PROXY}resources${user.avatar}`,
      });
    }
  }

  protected render(): string {
    return `
    <main class="center flex flex-column flex-x-center flex-center height-max-vh">
      {{{ avatar }}}
      <div style="width: 40%">
        {{{ form }}}
      </div>
      <div class="mt-s1">
        {{{ logOutButton }}}
      </div>
      {{#if error}}
        <div class="background--brand-secondary-danger mt-s1 mb-s1 pa-s1 text--brand-danger">
          {{ error }}
        </div>
      {{/if}}
      {{#if success}}
        <div class="background--brand-secondary-success mt-s1 mb-s1 pa-s1 text--brand-success">
          {{ success }}
        </div>
      {{/if}}
      <div class="mt-s1">
        {{{ link }}}
      </div>
    </main>
    `;
  }
}
