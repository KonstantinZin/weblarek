import {ensureElement, cloneTemplate} from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

 interface IBasket {
    items: HTMLElement[];
    total: number;
    disabled: boolean;
}

export class Basket extends Component<IBasket> {
  protected listContainer: HTMLElement;
  protected buttonElement: HTMLButtonElement;
  protected priceElement: HTMLElement;

  constructor(protected events: IEvents) { 
     const template = ensureElement<HTMLTemplateElement>('#basket');
     const container = cloneTemplate(template);
     super(container);

     this.listContainer = ensureElement<HTMLElement>('.basket__list', this.container);
     this.buttonElement = ensureElement<HTMLButtonElement>('.basket__button', this.container);
     this.priceElement = ensureElement<HTMLElement>('.basket__price', this.container);

     this.buttonElement.addEventListener('click', () => {
        this.events.emit('order:start');
    });
  }
  set items(items: HTMLElement[]) {
    this.listContainer.innerHTML = ''; 
    this.listContainer.append(...items);
  } 

  set total(value: number) {
    this.priceElement.textContent = `${value} синапсов`;
  }

  set disabled(value: boolean) {
    this.buttonElement.disabled = value;
  }
}