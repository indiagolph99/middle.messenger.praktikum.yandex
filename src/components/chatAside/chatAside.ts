import { Block } from '$core';
import { Preview, PreviewProps } from '$components/preview';

export default class ChatAside extends Block {
  constructor() {
    super();
    this.dispatchComponentDidMount();
  }

  componentDidMount() {
    const msgs = this.fetchChats();

    const components: Record<string, Preview> = {};
    const ids = msgs.map((msg) => {
      const preview = new Preview({ ref: msg.name, ...msg });
      components[preview.id] = preview;
      return `{{{ ${preview.id} }}}`;
    });
    this.setProps({ ...components });
    this.setState({ messages: ids.join(' ') });
  }

  fetchChats(): PreviewProps[] {
    // emulate fetching the messages
    return [
      {
        text: 'Lorem impsum ira vehementis specia tutam adme omnis petra gubernat aversione',
        time: '10:10',
        name: 'Noctis Lucis Caelum',
      },
      {
        text: 'Lorem impsum ira vehementis specia tutam adme omnis petra gubernat aversione',
        time: '10:10',
        name: 'Noctis Lucis Caelum',
      },
      {
        text: 'Lorem impsum ira vehementis specia tutam adme omnis petra gubernat aversione',
        time: '10:10',
        name: 'Noctis Lucis Caelum',
      },
    ];
  }

  protected render(): string {
    return `
      <div class="sidebar--aside flex flex-column stack-border">
          <div class="pa-s1">
              <input type="text" placeholder="Search" name="search" class="input input-search">
          </div>
          <div class="scrollbar stack-border">
              ${this.state.messages as string}
          </div>
          <div class="menu flex flex-column flex-x-center">
              <a class="py-s2" href="../info">Profile</a>
          </div>
      </div>
    `;
  }
}
