import { ensureElement } from '../../utils/utils';
import { Form, IForm } from '../views/Form';
import { IEvents } from '../base/Events';

export interface IContactsForm extends IForm {
    email: string;
    phone: string;
}

export class ContactsForm extends Form<IContactsForm> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;
    protected _email: string = '';
    protected _phone: string = '';

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

        this.emailInput.addEventListener('input', () => {
            this._email = this.emailInput.value;
            this.validate();
        });

        this.phoneInput.addEventListener('input', () => {
            this._phone = this.phoneInput.value;
            this.validate();
        });

        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            const isValid = this._email.trim() !== '' && this._phone.trim() !== '';
            if (isValid) {
                this.events.emit('contacts:submit', {
                    email: this._email,
                    phone: this._phone
                });
            }
        });
    }

    set email(value: string) {
        this._email = value;
        this.emailInput.value = value;
        this.validate();
    }

    set phone(value: string) {
        this._phone = value;
        this.phoneInput.value = value;
        this.validate();
    }

    protected validate() {
        const isValid = this._email.trim() !== '' && this._phone.trim() !== '';
        this.valid = isValid;
        this.errors = isValid ? '' : 'Укажите email и телефон';
    }
}