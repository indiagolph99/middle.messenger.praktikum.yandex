// eslint-disable-next-line max-classes-per-file
import Block, { Props } from '$core/Block';

export class BlockBasic extends Block {
  constructor(children?: Indexed) {
    super({ ...children });
  }

  protected render(): string {
    return `<div>i am a block!</div>`;
  }

  static CDM = jest.fn();

  static CDU = jest.fn();

  componentDidMount(props?: Props) {
    BlockBasic.CDM();
  }

  componentDidUpdate(oldProps: Props, newProps: Props) {
    BlockBasic.CDU();
    return true;
  }

  getProps() {
    return this.props;
  }
}

export class BlockWithSlot extends Block {
  protected render(): string {
    return `<div>{{{ slot }}}</div>`;
  }
}
