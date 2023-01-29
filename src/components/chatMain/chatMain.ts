import { Block } from '$core';
import { AddUser, Button, Form, Modal } from '$components';
import isEqual, { PlainObject } from '$utils/isEqual';
import EditChat from '$components/editChat/editChat';
import createSocket from '$utils/createSocket';
import { ChatsController } from '$controllers';
import MessagesList from '$components/messages/messages';

export default class ChatMain extends Block {
  socket?: WebSocket;

  controller: ChatsController;

  constructor() {
    const form = new Form(
      {
        itemsConfig: [
          {
            inputProps: {
              name: 'message',
              className: 'input-search',
              inlineForm: true,
            },
            hideError: true,
          },
        ],
        formId: 'message',
        inlineForm: true,
        buttonConfig: { text: 'send' },
      },
      { message: [{ required: true }] },
    );

    const addUser = new AddUser();
    const addUserModal = new Modal({ slot: addUser });

    const editChat = new EditChat();
    const editChatModal = new Modal({ slot: editChat });

    const addButton = new Button({
      type: 'button--ghost',
      text: 'Add users',
      events: {
        click: () => {
          addUserModal.show();
        },
      },
    });

    const editButton = new Button({
      type: 'button--ghost',
      text: 'Edit chat',
      events: {
        click: () => {
          editChatModal.show();
        },
      },
    });

    const deleteButton = new Button({
      type: Button.TYPES.DANGER,
      text: 'Delete chat',
      events: {
        click: () => {
          deleteChatModal.show();
        },
      },
    });

    const confirmDelete = new Button({
      type: Button.TYPES.DANGER,
      text: 'Confirm deletion',
      events: {
        click: () => {
          const currentChat = window.store.getState().currentChat.id;
          const oldChats = window.store.getState().chats;
          this.controller
            .deleteChat(currentChat)
            .then(() => {
              deleteChatModal.hide();
              window.store.dispatch({
                chats: oldChats.filter((it) => it.id !== currentChat),
              });
              window.store.dispatch({
                currentChat: window.store.getState().chats[0],
              });
            })
            .catch(() =>
              deleteChatModal.setProps({ error: 'Something went wrong' }),
            );
        },
      },
    });

    const deleteChatModal = new Modal({ slot: confirmDelete });

    const messages = new MessagesList();

    super({
      form,
      addButton,
      editButton,
      addUserModal,
      editChatModal,
      deleteButton,
      deleteChatModal,
      messages,
      events: {
        submit: (event: SubmitEvent) => {
          const formData = new FormData(event.target as HTMLFormElement);
          const formDataObj = Object.fromEntries(formData.entries());
          this.socket?.send(
            JSON.stringify({
              type: 'message',
              content: formDataObj.message,
            }),
          );
        },
      },
    });
    this.controller = new ChatsController();
    this.dispatchComponentDidMount();
  }

  componentDidMount() {
    window.store.on('changed', this.__onChangeStoreCallback);
  }

  __onChangeStoreCallback = () => {
    const oldChats = this.props?.currentChat;
    const newChats = window.store.getState()?.currentChat;
    const currentUser = window.store.getState()?.user?.id;
    if (
      !isEqual(
        (oldChats as PlainObject) || {},
        (newChats as unknown as PlainObject) || {},
      )
    ) {
      this.setProps({ currentChat: newChats });
      this.controller
        .getToken(newChats.id)
        .then((token: string) => {
          this.socket = createSocket(
            currentUser as string,
            newChats?.id,
            token,
          );
        })
        .catch(() => console.error('failed to retrieve token'));
    }
  };

  protected render(): string {
    return `
      <div class="sidebar--main flex flex-column stack-border">
        {{{ addUserModal }}}
        {{{ editChatModal }}}
        {{{ deleteChatModal }}}
        {{#if currentChat}}
        <div class="flex flex-y-center flex-x-space-between pa-s0">
          <div class="flex flex-y-center">
            <img
              alt="contact avatar"
              class="user-avatar"
              src="{{ currentChat.avatar }}"
              onerror="this.onerror = null; this.src = '/camera.svg'"
            >
            <strong class="ml-s1">{{ currentChat.title }}</strong>
          </div>
          <div>
            {{{ addButton }}}
            {{{ editButton }}}
            {{{ deleteButton }}}
          </div>
        </div>
        {{{ messages }}}
        {{/if}}
        {{#if currentChat}}
        <div class="flex pa-s0">
          {{{ form }}}
        </div>
        {{/if}}
      </div>
    `;
  }
}
