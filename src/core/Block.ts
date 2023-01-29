import { nanoid } from 'nanoid';
import Handlebars from 'handlebars';
import EventBus, { Listener } from './EventBus';

export interface BlockClass<T extends Props> extends Function {
  new (props: T): Block;
  componentName?: string;
}

type State = Record<string | number, unknown>;

export type Props = {
  events?: Record<string | number, unknown>;
  state?: Record<string | number, unknown>;
  settings?: { withInternalId: boolean };
  refs?: string[];
  ref?: string;
} & State;

type Events = Values<typeof Block.EVENTS>;

interface BlockMeta<P = Props> {
  propsAndChildren?: P;
}

type ListenerMap<P> = {
  [Block.EVENTS.INIT]: [void];
  [Block.EVENTS.FLOW_CDM]: [P];
  [Block.EVENTS.FLOW_CDU]: [P, P];
  [Block.EVENTS.FLOW_RENDER]: [void];
};

export default class Block<P extends Props = Props> {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render',
  } as const;

  public id: string;

  public componentName?: string;

  public ref: string | undefined;

  protected settings: Record<string, unknown>;

  private readonly _meta: BlockMeta;

  protected _element: Nullable<HTMLElement> = null;

  protected readonly props: P;

  protected children: { [id: string]: Block } = {};

  eventBus: EventBus<Events, ListenerMap<P>>;

  protected state: State = {};

  protected refs: { [key: string]: Block } = {};

  public constructor(propsAndChildren: P = {} as P) {
    this._meta = {
      propsAndChildren,
    };
    const { children, props } = this.getChildrenFromProps(propsAndChildren);

    this.settings = propsAndChildren?.settings || { withInternalId: true };
    this.id = nanoid(6);
    this.children = children;
    this.eventBus = new EventBus<Events, ListenerMap<P>>();
    this.props = this._makePropsProxy({ ...props });
    this.state = this._makePropsProxy(propsAndChildren.state || {});
    this.ref = this.props.ref;
    this._registerEvents(this.eventBus);
    this.eventBus.emit(Block.EVENTS.INIT);
  }

  _registerEvents(eventBus: EventBus<Events, ListenerMap<P>>) {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(
      Block.EVENTS.FLOW_CDM,
      this._componentDidMount.bind(this) as Listener<P[]>,
    );
    eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  _createResources() {
    this._element = this._createDocumentElement('div');
  }
  //
  // protected getStateFromProps(props: any): void {
  //   this.state = {};
  // }

  init() {
    this._createResources();
    this.eventBus.emit(Block.EVENTS.FLOW_RENDER);
  }

  _componentDidMount(props: P) {
    this.componentDidMount(props);
  }

  componentDidMount(props?: P) {}

  dispatchComponentDidMount() {
    this.eventBus.emit(Block.EVENTS.FLOW_CDM, this.props);
  }

  _componentDidUpdate(oldProps: P, newProps: P) {
    const response = this.componentDidUpdate(oldProps, newProps);
    if (!response) {
      return;
    }
    this._render();
  }

  componentDidUpdate(oldProps: P, newProps: P) {
    return true;
  }

  setProps = (nextProps: P) => {
    if (!nextProps) {
      return;
    }

    Object.assign(this.props, nextProps);
  };

  setState = (nextState: State) => {
    if (!nextState) {
      return;
    }

    Object.assign(this.state, nextState);
  };

  get element() {
    return this._element;
  }

  _render() {
    const fragment = this._compile();

    this._removeEvents();
    const newElement = fragment?.firstElementChild;

    if (newElement !== null) {
      if (this.settings.withInternalId) {
        newElement?.setAttribute('data-id', this.id);
      }
      this._element?.replaceWith(newElement);

      this._element = newElement as HTMLElement;
    }

    this._addEvents();
  }

  protected render(): string {
    return '';
  }

  getContent(): HTMLElement {
    // Хак, чтобы вызвать CDM только после добавления в DOM
    if (this.element?.parentNode?.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      setTimeout(() => {
        if (
          this.element?.parentNode?.nodeType !== Node.DOCUMENT_FRAGMENT_NODE
        ) {
          this.eventBus.emit(Block.EVENTS.FLOW_CDM, this.props);
        }
      }, 100);
    }

    return this.element as HTMLElement;
  }

  _makePropsProxy<T extends P | State>(props: T): T {
    const { eventBus, children } = this;

    return new Proxy(props, {
      get(target: T, prop: string) {
        const value = target[prop];
        return typeof value === 'function'
          ? (value.bind(target) as unknown)
          : value;
      },
      set(target: T, prop: string, value: unknown) {
        if (value instanceof Block) {
          children[prop] = value as Block;
          return true;
        }
        const old = { ...target };
        // eslint-disable-next-line no-param-reassign
        target[prop] = value;

        eventBus.emit(Block.EVENTS.FLOW_CDU, old as P, target as P);
        return true;
      },
      deleteProperty() {
        throw new Error('Нет доступа');
      },
    });
  }

  protected getChildrenFromProps(propsAndChildren: P): {
    children: Record<string, Block>;
    props: P;
  } {
    const children: Record<Keys<P>, Block> = {} as Record<Keys<P>, Block>;
    const props: P = {} as P;

    const entries = Object.entries(propsAndChildren) as Array<
      [Keys<P>, Values<P>]
    >;

    entries.forEach(([key, value]) => {
      if (value instanceof Block) {
        children[key] = value as Block;
        if (value.ref) {
          this.refs[value.ref] = value;
        }
      } else {
        props[key] = value;
      }
    });

    return { children, props };
  }

  _createDocumentElement(tagName: string) {
    return document.createElement(tagName);
  }

  _removeEvents() {
    const { events } = this.props;

    if (!events || !this._element) {
      return;
    }

    Object.entries(events).forEach(([event, listener]) =>
      this._element?.removeEventListener(
        event as keyof HTMLElementEventMap,
        listener as EventListenerOrEventListenerObject,
      ),
    );
  }

  _addEvents() {
    const { events } = this.props;

    if (!events) {
      return;
    }

    Object.entries(events).forEach(([event, listener]) =>
      this._element?.addEventListener(
        event as keyof HTMLElementEventMap,
        listener as EventListenerOrEventListenerObject,
      ),
    );
  }

  private _compile(): DocumentFragment {
    const fragment = document.createElement('template');

    const children: Record<string, string> = {};
    Object.entries(this.children).forEach(([key, child]) => {
      children[key] = `<div data-id="${child.id}"></div>`;
    });
    /**
     * Рендерим шаблон
     */
    const template = Handlebars.compile(this.render());
    fragment.innerHTML = template({
      ...this.state,
      ...this.props,
      ...children,
      ...this.refs,
    });

    Object.entries(this.children).forEach(([id, component]) => {
      const stub = fragment.content.querySelector(
        `[data-id="${component.id}"]`,
      );

      if (stub) {
        const content = component.getContent();
        stub.replaceWith(content);
      }
    });

    if (fragment.content.childElementCount > 1) {
      throw new Error(
        `${this.constructor.name}: Template must have only one root element`,
      );
    }

    return fragment.content;
  }

  show() {
    this.getContent().style.display = '';
  }

  hide() {
    this.getContent().style.display = 'none';
  }
}
