import { Block } from '$core';
import { Props } from '$core/Block';

export interface PreviewProps extends Props {
  text: string;
  time: string;
  name: string;
  // TODO: add img url here later
  counter?: number;
}

export default class Preview extends Block<PreviewProps> {
  protected render(): string {
    return `
      <div class="preview">
          <figure class="ma-0"><img alt="contact avatar" class="user-avatar" src="../../assets/camera.svg"></figure>
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
