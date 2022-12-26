import { Block } from '$core';
import { Button, Form } from '$components';
import { Message, MessageProps } from '$components/message';

export default class ChatMain extends Block {
  constructor() {
    const form = new Form(
      {
        itemsConfig: [
          {
            inputProps: {
              name: 'message',
              className: 'input-search',
              inlineForm: true,
            },
            hideError: true,
          },
        ],
        formId: 'message',
        inlineForm: true,
        buttonConfig: { text: 'send' },
      },
      { message: [{ required: true }] },
    );

    const mediaButton = new Button({
      type: 'button--ghost',
      formId: 'message',
      text: 'media',
    });

    const infoButton = new Button({
      type: 'button--ghost',
      text: '•••',
    });

    super({ form, mediaButton, infoButton });
    this.dispatchComponentDidMount();
  }

  componentDidMount() {
    const msgs = this.fetchMessages();

    const components: Record<string, Message> = {};
    const ids = msgs.map((msg) => {
      const preview = new Message({ ...msg });
      components[preview.id] = preview;
      return `{{{ ${preview.id} }}}`;
    });
    this.setProps({ ...components });
    this.setState({ messages: ids.join(' ') });
  }

  fetchMessages(): MessageProps[] {
    // emulate fetching the messages
    return [
      {
        text: 'Lorem impsum ira vehementis specia tutam adme omnis petra gubernat aversione',
        time: '10:11',
        from: true,
      },
      {
        text: 'Lorem impsum ira vehementis specia tutam adme omnis petra gubernat aversione',
        time: '10:12',
      },
      {
        text: 'Lorem impsum ira vehementis specia tutam adme omnis petra gubernat aversione',
        time: '10:13',
        from: true,
      },
    ];
  }

  protected render(): string {
    return `
      <div class="sidebar--main flex flex-column stack-border">
        <div class="flex flex-y-center pa-s0">
          <div class="flex flex-y-center">
            <img alt="contact avatar" class="user-avatar user-avatar--to-info" src="../../assets/camera.svg">
            <strong class="ml-s1">Kek</strong>
          </div>
          {{{ infoButton }}}
        </div>
        <div class="scrollbar">
          ${this.state.messages as string}
        </div>
        <div class="flex pa-s0">
          {{{ mediaButton }}}
          {{{ form }}}
        </div>
      </div>
    `;
  }
}
