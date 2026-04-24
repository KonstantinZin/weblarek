import { ensureElement, ensureAllElements } from '../../utils/utils';
import { Form, IForm } from './Form';
import { IEvents } from '../base/Events';

export interface IOrderForm extends IForm {
    payment: string;
    address: string;
}

export class OrderForm extends Form<IOrderForm> {
    protected paymentButtons: HTMLButtonElement[];
    protected addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this.paymentButtons = ensureAllElements<HTMLButtonElement>('.order__buttons button', this.container);
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

        this.paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.events.emit('order:change', {
                    field: 'payment',
                    value: button.name
                });
            });
        });

        this.addressInput.addEventListener('input', () => {
            this.events.emit('order:change', {
                field: 'address',
                value: this.addressInput.value
            });
        });

        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            this.events.emit('order:submit');
        });
    }

    set payment(value: string) {
        this.paymentButtons.forEach(button => {
            if (button.name === value) {
                button.classList.add('button_alt-active');
            } else {
                button.classList.remove('button_alt-active');
            }
        });
    }

    set address(value: string) {
        this.addressInput.value = value;
    }

    set errors(value: string) {
        this.errorsContainer.textContent = value;
    }
}