import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export interface ICardData {
    title: string;
    price: number | null;
}

export class Card<T extends ICardData> extends Component<T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement, protected actions?: { onClick?: () => void }) {
        super(container);

        this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);

        if (actions?.onClick) {
            this.container.addEventListener('click', actions.onClick);
        }
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        this.priceElement.textContent = value ? `${value} синапсов` : 'Бесценно';
    }
}