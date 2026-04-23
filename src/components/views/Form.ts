import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export interface IForm {
    valid: boolean;
    errors: string;
}

export class Form<T extends IForm> extends Component<T> {
    protected submitButton: HTMLButtonElement;
    protected errorsContainer: HTMLElement;

    constructor(container: HTMLFormElement) {
        super(container);

        this.submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this.errorsContainer = ensureElement<HTMLElement>('.form__errors', this.container);

        this.container.addEventListener('submit', (e) => {
            e.preventDefault();
        });
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errors(value: string) {
        this.errorsContainer.textContent = value;
    }
}