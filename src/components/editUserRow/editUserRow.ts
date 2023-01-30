import { Block } from '$core';
import { ChatsController } from '$controllers';
import { Props } from '$core/Block';
import { Button } from '$components';

interface EditUserRowProps extends Props {
  user: User;
  chatId: string;
}

export default class EditUserRow extends Block {
  controller: ChatsController;

  constructor({ user, chatId }: EditUserRowProps) {
    const deleteButton = new Button({
      text: 'X',
      type: Button.TYPES.DANGER,
      events: {
        click: () => {
          this.controller
            .deleteUser(user.id as string, chatId)
            .then(() => this.hide())
            .catch(() => {
              this.setProps({
                error: 'Something went wrong',
              });
              setTimeout(() => this.setProps({ error: '' }), 3000);
            });
        },
      },
    });
    super({ user, deleteButton });
    this.controller = new ChatsController();
  }

  protected render(): string {
    return `
      <div class="flex flex-x-space-between mt-s1">
        <div>{{ user.login }}</div>
        {{{ deleteButton }}}
      </div>
    `;
  }
}
