import {ensureElement} from '../../utils/utils';
import { Component } from '../base/Component';
import { categoryMap, CDN_URL } from '../../utils/constants';

export interface ICardActions {
    onClick?: (event: MouseEvent) => void;
}

export interface ICardData {
    title: string;
    price: number | null;
    category?: string;
    image?: string;
}

export class Card<T extends ICardData> extends Component<T> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected categoryElement?: HTMLElement;
    protected imageElement?: HTMLImageElement;
     protected _id!: string;

    constructor(container: HTMLElement, protected actions?: ICardActions) {
        super(container);

        this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
        this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
        
        this.categoryElement = this.container.querySelector('.card__category') as HTMLElement;
        this.imageElement = this.container.querySelector('.card__image') as HTMLImageElement;

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

    set category(value: string) {
        if (this.categoryElement) {
            this.categoryElement.textContent = value;
            
            this.categoryElement.className = '';
            this.categoryElement.classList.add('card__category');
            
            const className = (categoryMap as Record<string, string>)[value] || 'card__category_other';
            this.categoryElement.classList.add(className);
        }
    }

    set image(value: string) {
        if (this.imageElement) {
            this.setImage(this.imageElement, CDN_URL + value, this.titleElement.textContent);
        }
    }

      set id(value: string) {
        this._id = value;
    }
}