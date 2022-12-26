import { renderDOM } from '$core';
import { Error, NonChat } from '$components';

const notFound = new Error({ code: 500, message: 'Something went wrong' });
const main = new NonChat(notFound);
renderDOM(main);
