import { ensureElement, cloneTemplate } from '../../utils/utils';
import { Card } from './Card';
import { IEvents } from '../base/Events';
import { IProduct } from '../../types';

export type TCardPreview = Pick<IProduct, 'id' | 'title' | 'price' | 'category' | 'description' | 'image'>;

export class CardPreview extends Card<TCardPreview> {
    protected descriptionElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(protected events: IEvents) {
        const template = ensureElement<HTMLTemplateElement>('#card-preview');
        const container = cloneTemplate(template);
        super(container);

        this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

        this.buttonElement.addEventListener('click', () => {
          if(this.buttonElement.textContent === 'Купить') {
            this.events.emit('card:add' , {id: this._id});
          }
          else {
            this.events.emit('card:remove' , {id: this._id});
          }
        })
    }

    set description(value: string) {
      this.descriptionElement.textContent = String(value);
    }

    set buttonText(value:string) {
      this.buttonElement.textContent = String(value);
    }

    
    set buttonDisabled(value: boolean) {
        this.buttonElement.disabled = value;
    }

}