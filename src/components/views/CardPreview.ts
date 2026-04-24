import { ensureElement, cloneTemplate } from '../../utils/utils';
import { CardWithImage } from './CardWithImage';
import { IEvents } from '../base/Events';
import { IProduct } from '../../types';

export type TCardPreview = Pick<IProduct, 'title' | 'price' | 'category' | 'description' | 'image'>;

export class CardPreview extends CardWithImage<TCardPreview> {
    protected descriptionElement: HTMLElement;
    protected buttonElement: HTMLButtonElement;

    constructor(protected events: IEvents) {
        const template = ensureElement<HTMLTemplateElement>('#card-preview');
        const container = cloneTemplate(template);
        super(container);

        this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
        this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

        this.buttonElement.addEventListener('click', () => {
            this.events.emit('card:action');
        });
    }

    set description(value: string) {
        this.descriptionElement.textContent = String(value);
    }

set inBasket(value: boolean) {
    if (this.buttonElement.disabled) {
        this.buttonElement.textContent = 'Недоступно';
    } else {
        this.buttonElement.textContent = value ? 'Удалить из корзины' : 'Купить';
    }
}

    set buttonDisabled(value: boolean) {
        this.buttonElement.disabled = value;
    }
}