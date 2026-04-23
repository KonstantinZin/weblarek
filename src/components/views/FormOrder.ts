import { ensureElement, ensureAllElements } from '../../utils/utils';
import { Form, IForm } from '../views/Form';
import { IEvents } from '../base/Events';

export interface IOrderForm extends IForm {
    payment: string;
    address: string;
}

export class OrderForm extends Form<IOrderForm> {
    protected paymentButtons: HTMLButtonElement[];
    protected addressInput: HTMLInputElement;
    protected _payment: string = '';
    protected _address: string = '';

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this.paymentButtons = ensureAllElements<HTMLButtonElement>('.order__buttons button', this.container);
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.container);

        this.paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.payment = button.name;
            });
        });

        this.addressInput.addEventListener('input', () => {
            this._address = this.addressInput.value;
            this.validate();
        });

        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
            const isValid = this._payment !== '' && this._address.trim() !== '';
            if (isValid) {
                this.events.emit('order:submit', {
                    payment: this._payment,
                    address: this._address
                });
            }
        });
    }

    set payment(value: string) {
        this._payment = value;
        
        this.paymentButtons.forEach(button => {
            if (button.name === value) {
                button.classList.add('button_alt-active');
            } else {
                button.classList.remove('button_alt-active');
            }
        });
        
        this.validate();
    }

    set address(value: string) {
        this._address = value;
        this.addressInput.value = value;
        this.validate();
    }

    protected validate() {
        const isValid = this._payment !== '' && this._address.trim() !== '';
        this.valid = isValid;
        this.errors = isValid ? '' : 'Выберите способ оплаты и укажите адрес';
    }
}