import { Form } from './Form';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';
import { validateEmail, validatePhone } from '../../utils/utils';

interface IContacts {
    email: string;
    phone: string;
    errors: string;
}

export class Contacts extends Form<IContacts> {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;
    protected _errors: HTMLElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
        this._errors = ensureElement<HTMLElement>('.form__errors', container);

        this._emailInput.addEventListener('input', () => {
            this.email = this._emailInput.value;
            events.emit('contacts.email:change', { email: this._emailInput.value });
            this.validateForm();
        });

        this._phoneInput.addEventListener('input', () => {
            this.phone = this._phoneInput.value;
            events.emit('contacts.phone:change', { phone: this._phoneInput.value });
            this.validateForm();
        });
    }

    set email(value: string) {
        this._emailInput.value = value;
    }

    set phone(value: string) {
        this._phoneInput.value = value;
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }

    isValid(): boolean {
        return validateEmail(this._emailInput.value) && validatePhone(this._phoneInput.value);
    }

    private validateForm() {
        const emailValid = validateEmail(this._emailInput.value);
        const phoneValid = validatePhone(this._phoneInput.value);

        if (!emailValid && !phoneValid) {
            this.errors = 'Введите корректный email и телефон';
            this.valid = false;
        } else if (!emailValid) {
            this.errors = 'Введите корректный email';
            this.valid = false;
        } else if (!phoneValid) {
            this.errors = 'Введите корректный телефон';
            this.valid = false;
        } else {
            this.errors = '';
            this.valid = true;
        }
    }

    render(data: IContacts): HTMLElement {
        super.render(data);
        this.email = data.email;
        this.phone = data.phone;
        this.errors = data.errors || '';
        this.validateForm();
        return this.container;
    }
}