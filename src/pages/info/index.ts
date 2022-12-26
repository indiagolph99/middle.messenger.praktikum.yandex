import { renderDOM } from '$core';
import { Info, NonChat } from '$components';

const info = new Info();
const main = new NonChat(info);
renderDOM(main);
