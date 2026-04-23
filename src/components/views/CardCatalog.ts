import { ensureElement, cloneTemplate } from '../../utils/utils';
import { Card } from './Card';
import { IEvents } from '../base/Events';
import { IProduct } from '../../types';

export type TCardCatalog = Pick<IProduct, 'id' | 'title' | 'price' | 'image' | 'category'>;

export class CardCatalog extends Card<TCardCatalog> {
    constructor(protected events: IEvents, actions?: { onClick?: () => void }) {
        const template = ensureElement<HTMLTemplateElement>('#card-catalog');
        const container = cloneTemplate(template);
        super(container);

        if (actions?.onClick) {
            this.container.addEventListener('click', actions.onClick);
        } else {
            this.container.addEventListener('click', () => {
                this.events.emit('card:select', { id: this._id });
            });
        }
    }

}