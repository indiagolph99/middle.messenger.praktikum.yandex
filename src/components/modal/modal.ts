import { Block } from '$core';
import { Props } from '$core/Block';
import { Button } from '$components/button';

export interface ModalProps extends Props {
  slot?: Block;
  error?: string;
}

export default class Modal extends Block<ModalProps> {
  constructor(props: ModalProps = {}) {
    const button = new Button({
      text: 'X',
      events: {
        click: () => this.hide(),
      },
    });

    super({ ...props, button });
    this.hide();
  }

  protected render(): string {
    return `
      <div class="mask width-max-vw flex flex-column flex-x-center flex-center height-max-vh">
        <div class="card background--brand-white mt-s2 ma-0-auto container container-sm pa-s1">
          <div>
            <div class="flex flex-x-end">
                {{{ button }}}
            </div>
            {{{ slot }}}
            {{#if error}}
          <div class="background--brand-secondary-danger mb-s1 pa-s1 text--brand-danger">
            {{ error }}
          </div>
          {{/if}}
          </div>
        </div>
      </div>
    `;
  }
}
