import { Block } from '$core';
import { Props } from '$core/Block';

export interface MessageProps extends Props {
  text: string;
  time?: string;
  from?: boolean;
}

export default class Message extends Block {
  constructor(props: MessageProps) {
    const { from } = { from: false, ...props };
    super({ from, ...props });
  }

  protected render(): string {
    return `
      <div class="pa-s0">
        <div class="message ${this.props.from ? 'message--from' : ''}">
            <div>
                {{ text }}
            </div>
            <div class="message__time">{{ time }}</div>
        </div>
      </div>
    `;
  }
}
