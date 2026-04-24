import { ensureElement } from '../../utils/utils';
import { Form, IForm } from './Form';
import { IEvents } from '../base/Events';

export interface IContactsForm extends IForm {
    email: string;
    phone: string;
}

export class ContactsForm extends Form<IContactsForm> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

        this.emailInput.addEventListener('input', () => {
            this.events.emit('contacts:change', {
                field: 'email',
                value: this.emailInput.value
            });
        });

        this.phoneInput.addEventListener('input', () => {
            this.events.emit('contacts:change', {
                field: 'phone',
                value: this.phoneInput.value
            });
        });

        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            this.events.emit('contacts:submit');
        });
    }

    set email(value: string) {
        this.emailInput.value = value;
    }

    set phone(value: string) {
        this.phoneInput.value = value;
    }

    set errors(value: string) {
        this.errorsContainer.textContent = value;
    }
}