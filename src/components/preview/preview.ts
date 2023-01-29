import { Block } from '$core';
import { Props } from '$core/Block';

export interface PreviewProps extends Props {
  text: string;
  time: string;
  name: string;
  counter?: number;
  id: string;
  avatar?: string;
}

export default class Preview extends Block<PreviewProps> {
  constructor(props: PreviewProps) {
    super({
      ...props,
      events: {
        click: () => {
          window.store.dispatch({
            currentChat: {
              id: this.props.id,
              title: this.props.name,
              avatar: this.props.avatar,
            },
          });
        },
      },
    });
  }

  protected render(): string {
    return `
      <div class="preview">
          <figure class="ma-0">
            <img
              alt="contact avatar"
              class="user-avatar"
              src="{{ avatar }}"
              onerror="this.onerror = null; this.src = '/camera.svg'"
            >
          </figure>
          <div class="preview__message">
              <strong>{{ name }}</strong>
              <p class="preview__message__text">{{ text }}</p>
          </div>
          <div class="flex flex-column flex-space-between">
              <p class="text--small text--brand-secondary">{{ time }}</p>
              {{#if counter}}
                  <span class="counter">{{ counter }}</span>
              {{/if}}
          </div>
      </div>
    `;
  }
}
