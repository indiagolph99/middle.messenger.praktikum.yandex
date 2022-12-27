import { renderDOM } from '$core';
import { Error, NonChat } from '$components';

const notFound = new Error({ code: 404, message: 'Nothing to be found' });
const main = new NonChat(notFound);
renderDOM(main);
