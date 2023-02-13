import { Block } from '$core';
import { ChatsController } from '$controllers';
import { EditUserRow } from '$components/editUserRow';
import transformUser from '$utils/apiTransformers';
import isEqual, { PlainObject } from '$utils/isEqual';

export default class EditChat extends Block {
  controller: ChatsController;

  constructor() {
    super();
    this.controller = new ChatsController();
    this.dispatchComponentDidMount();
  }

  componentDidMount() {
    window.store.on('changed', this.__onChangeStoreCallback);
  }

  __onChangeStoreCallback = () => {
    const oldChats = this.props.currentChat;
    const newChats = window.store.getState().currentChat;
    if (
      !isEqual(
        (oldChats as PlainObject) || {},
        (newChats as unknown as PlainObject) || {},
      )
    ) {
      const chatId = window.store.getState()?.currentChat?.id || '';
      this.controller
        .getUsersFromChat(chatId)
        .then((users) => {
          window.store.dispatch({ currentChatUsers: users });
          const components: Record<string, EditUserRow> = {};
          const ids = users.map((user) => {
            const userModel = transformUser(user);
            const row = new EditUserRow({ user: userModel, chatId });
            components[row.id] = row;
            return `{{{ ${row.id} }}}`;
          });
          this.setProps({ ...components });
          this.setProps({ currentChat: newChats });
          this.setProps({ rows: ids.join(' ') });
        })
        .catch(() => {});
    }
  };

  protected render(): string {
    return `
    <div>
      ${(this.props.rows as string) || 'here'}
    </div>
    `;
  }
}
