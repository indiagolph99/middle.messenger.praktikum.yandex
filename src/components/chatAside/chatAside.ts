import { Block } from '$core';
import { Props } from '$core/Block';
import { Preview } from '$components/preview';
import { Link, Button, Modal, CreateChat } from '$components';
import { ChatsController } from '$controllers';
import isEqual, { PlainObject } from '$utils/isEqual';
import { APP_PROXY } from '$utils/fetch';

interface ChatAsideProps extends Props {
  profileLink?: Link;
  modal?: Modal;
  addButton?: Button;
}

export default class ChatAside extends Block<ChatAsideProps> {
  controller: ChatsController;

  constructor() {
    const profileLink = new Link({ path: '/settings', text: 'Profile' });
    const createChat = new CreateChat();
    const modal = new Modal({ slot: createChat });
    const addButton = new Button({
      text: 'Create a chat',
      events: {
        click: () => {
          modal.show();
        },
      },
    });
    super({ profileLink, addButton, modal });
    this.controller = new ChatsController();
    this.dispatchComponentDidMount();
  }

  composeMessages() {
    const msgs = window.store.getState().chats;
    this.setState({ chats: msgs });

    const components: Record<string, Preview> = {};
    const ids = msgs.map((msg) => {
      const date = new Date(msg?.last_message?.time);
      const preview = new Preview({
        ref: msg.title,
        text: msg?.last_message?.content || 'Chat created',
        avatar: `${APP_PROXY}resources/${msg?.avatar}`,
        time: date.toTimeString().split(' ')[0],
        name: msg.title,
        id: msg.id,
      });
      components[preview.id] = preview;
      return `{{{ ${preview.id} }}}`;
    });
    this.setProps({ ...components });
    this.setState({ messages: ids.join(' ') });
  }

  async componentDidMount() {
    await this.controller.getChats();
    this.composeMessages();
    window.store.on('changed', this.__onChangeStoreCallback);
  }

  __onChangeStoreCallback = () => {
    const oldChats = this.state.chats;
    const newChats = window.store.getState().chats;
    if (!isEqual(oldChats as PlainObject, newChats as unknown as PlainObject)) {
      this.composeMessages();
    }
  };

  protected render(): string {
    return `
      <div class="sidebar--aside flex flex-column stack-border">
          {{{ modal }}}
          <div class="pa-s1 flex flex-x-center">
              {{{ addButton }}}
          </div>
          <div class="scrollbar stack-border">
              ${this.state.messages as string}
          </div>
          <div class="menu flex flex-column flex-x-center py-s2">
              {{{ profileLink }}}
          </div>
      </div>
    `;
  }
}
