import { ensureElement, cloneTemplate } from '../../utils/utils';
import { Card } from './Card';
import { IEvents } from '../base/Events';
import { IProduct } from '../../types';

export type TCardBasket = Pick<IProduct, 'title' | 'price'> & { index: number };

export class CardBasket extends Card<TCardBasket> {
    protected indexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(protected events: IEvents, onDelete?: () => void) {
        const template = ensureElement<HTMLTemplateElement>('#card-basket');
        const container = cloneTemplate(template);
        super(container);

        this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        if (onDelete) {
            this.deleteButton.addEventListener('click', onDelete);
        }
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}