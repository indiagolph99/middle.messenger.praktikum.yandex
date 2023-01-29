import { Block } from '$core';
import { Props } from '$core/Block';
import { Input } from '$components/input';

export interface AvatarProps extends Props {
  url?: string;
  formId: string;
}

function readURL(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files !== null && target.files[0]) {
    const reader = new FileReader();

    const avatarElement = document.querySelector('#avatar');

    reader.addEventListener('load', (e) => {
      if (
        avatarElement !== null &&
        e.target !== null &&
        typeof e.target.result === 'string'
      ) {
        avatarElement.setAttribute('src', e.target.result);
      }
    });

    reader.readAsDataURL(target.files[0]);
  }
}

export default class Avatar extends Block {
  constructor(props: AvatarProps) {
    const input = new Input({
      type: 'file',
      name: 'avatar',
      formId: props.formId,
      events: {
        change: readURL,
      },
    });
    super({ input, ...props });
  }

  protected render(): string {
    return `
      <label>
        <div class="personal-image">
          {{{ input }}}
          <figure class="personal-figure">
            <img
              id="avatar"
              alt="contact avatar"
              class="personal-avatar"
              src="{{ url }}"
              onerror="this.onerror = null; this.src = '/camera.svg'"
            >
            <figcaption class="personal-figcaption">
            </figcaption>
          </figure>
        </div>
      </label>
    `;
  }
}
