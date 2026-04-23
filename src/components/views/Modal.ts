import {ensureElement} from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  protected contentContainer: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);
    this.contentContainer = ensureElement<HTMLElement>('.modal__content', this.container);
    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);

    this.closeButton.addEventListener('click', () => {
      this.events.emit('modal:close');
    });

    this.container.addEventListener('click', (event) => {
    if (event.target === this.container) {
        this.closeModal();
    }
});
  }

  public openModal() {
    this.container.classList.add('modal_active');
  }

  public closeModal() {
    this.container.classList.remove('modal_active');
  }

  set content(value:HTMLElement) {
    this.contentContainer.innerHTML = '';
    this.contentContainer.append(value);
  }

}