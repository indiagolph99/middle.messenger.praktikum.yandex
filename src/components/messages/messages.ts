import { Block } from '$core';
import { Message } from '$components';
import isEqual, { PlainObject } from '$utils/isEqual';

export default class MessagesList extends Block {
  constructor() {
    super();
    this.dispatchComponentDidMount();
  }

  composeMessages() {
    const msgs = window.store.getState().messages;
    const currentUser = window.store.getState().user;
    const components: Record<string, Message> = {};

    const ids = msgs.map((msg) => {
      const date = new Date(msg.time || '');
      const preview = new Message({
        text: msg.content,
        time: date.toTimeString().split(' ')[0],
        from: msg.user_id === currentUser?.id,
      });
      components[preview.id] = preview;
      return `{{{ ${preview.id} }}}`;
    });
    this.setProps({ ...components });
    this.setProps({ ids: ids.reverse().join(' ') });
    this.setProps({ socketMessages: msgs });
  }

  componentDidMount() {
    window.store.on('changed', this.__onChangeStoreCallback);
  }

  __onChangeStoreCallback = () => {
    const oldMsgs = window.store.getState().messages;
    const newMsgs = this.props.socketMessages;

    if (
      !isEqual(
        (oldMsgs as unknown as PlainObject) || [],
        (newMsgs as PlainObject) || [],
      )
    ) {
      this.composeMessages();
      const messages = document.querySelector('#messages');
      if (messages) {
        messages.scrollTo(0, messages.scrollHeight);
      }
    }
  };

  protected render(): string {
    return `
      <div id="messages" class="scrollbar flex flex-column">
        ${(this.props.ids as string) || ''}
      </div>
    `;
  }
}
