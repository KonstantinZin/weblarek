import { Card, ICardData } from './Card';
import { categoryMap, CDN_URL } from '../../utils/constants';

export class CardWithImage<T extends ICardData> extends Card<T> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement, protected actions?: { onClick?: () => void }) {
        super(container, actions);
        
        this.categoryElement = this.container.querySelector('.card__category') as HTMLElement;
        this.imageElement = this.container.querySelector('.card__image') as HTMLImageElement;
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
            this.setImage(this.imageElement, CDN_URL + value, this.title);
        }
    }
}