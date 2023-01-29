import { Block } from '$core';

export default class Preview extends Block {
  protected render(): string {
    return `
      <div class="center flex flex-column flex-center">
        <h3 class="text--large">{{ code }}</h3>
        <p>{{ message }}</p>
      </div>
    `;
  }
}
