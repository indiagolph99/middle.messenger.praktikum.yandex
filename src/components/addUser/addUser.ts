import { Block } from '$core';
import { Form } from '$components';
import { FormItemProps } from '$components/formItem';
import { ChatsController } from '$controllers';

export default class AddUser extends Block {
  controller: ChatsController;

  constructor() {
    const itemsConfig = [
      {
        inputProps: {
          name: 'username',
          type: 'text',
          placeholder: 'Login',
        },
      },
    ] as FormItemProps[];
    const form = new Form(
      {
        itemsConfig,
        formId: 'profile',
        buttonConfig: { text: 'Add' },
        noAutoComplete: true,
      },
      {},
    );
    super({
      form,
      events: {
        submit: (event: SubmitEvent) => {
          const chatId = window.store.getState()?.currentChat?.id || '';
          const formData = new FormData(event.target as HTMLFormElement);
          const formDataObj = Object.fromEntries(formData.entries());
          this.controller
            .addUser(formDataObj.username as string, chatId)
            .then(() => {
              this.setProps({
                success: 'User added!',
              });
              setTimeout(() => this.setProps({ success: '' }), 3000);
              return this.controller.getChats();
            })
            .catch(() => {
              this.setProps({
                error: 'Something went wrong',
              });
              setTimeout(() => this.setProps({ error: '' }), 3000);
            });
        },
      },
    });
    this.controller = new ChatsController();
  }

  protected render(): string {
    return `
    <div>
      {{{ form }}}
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
    </div>
    `;
  }
}
