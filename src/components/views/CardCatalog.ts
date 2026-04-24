import { ensureElement, cloneTemplate } from '../../utils/utils';
import { CardWithImage } from './CardWithImage';
import { IEvents } from '../base/Events';
import { ICardData } from './Card';

export class CardCatalog extends CardWithImage<ICardData> {
    constructor(protected events: IEvents, onClick?: () => void) {
        const template = ensureElement<HTMLTemplateElement>('#card-catalog');
        const container = cloneTemplate(template);
        super(container, { onClick });
    }
}