import { Block } from '$core';
import { Form } from '$components';
import { FormItemProps } from '$components/formItem';
import { ChatsController } from '$controllers';

export default class CreateChat extends Block {
  controller: ChatsController;

  constructor() {
    const itemsConfig = [
      {
        inputProps: {
          name: 'title',
          type: 'text',
          placeholder: 'Chat name',
        },
      },
    ] as FormItemProps[];
    const form = new Form(
      {
        ref: 'createChatForm',
        itemsConfig,
        formId: 'chatCreate',
        buttonConfig: { text: 'Create' },
        noAutoComplete: true,
      },
      {},
    );
    super({
      form,
      events: {
        submit: (event: SubmitEvent) => {
          this.controller
            .createChat(event)
            .then(() => {
              this.setProps({
                success: 'Chat created',
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
