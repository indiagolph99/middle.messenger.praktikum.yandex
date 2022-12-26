import { Block } from '$core';
import { Props } from '$core/Block';
import { Input } from '$components/input';

export interface AvatarProps extends Props {
  url?: string;
  formId: string;
}

export default class Avatar extends Block {
  constructor(props: AvatarProps) {
    const input = new Input({
      type: 'file',
      name: 'avatar',
      formId: props.formId,
    });
    super({ input, ...props });
  }

  protected render(): string {
    return `
      <div class="personal-image">
        <fieldset>
          {{{ input }}}
        </fieldset>
        <figure class="personal-figure">
          <img src="{{ url }}" class="personal-avatar" alt="avatar">
          <figcaption class="personal-figcaption">
              <img src="../assets/camera.svg" alt="avatar">
          </figcaption>
        </figure>
      </div>
    `;
  }
}
