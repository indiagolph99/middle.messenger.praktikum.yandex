import { Block } from '$core';
import { Props } from '$core/Block';

export interface LinkProps extends Props {
  text?: string;
  path?: string;
}

export default class Link extends Block<LinkProps> {
  constructor(props: LinkProps = {}) {
    super({ ...props });
    this.setProps({ events: { click: () => this.onNavigate() } });
  }

  onNavigate() {
    window.router.go(this.props.path || '');
  }

  protected render(): string {
    return `
    <span>
      <a>{{ text }}</a>
    </span>
    `;
  }
}
