import { Form } from './Form';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

interface IContacts {
    email: string;
    phone: string;
    errors: string;
    valid: boolean;
}

export class Contacts extends Form<IContacts> {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);

        this._emailInput.addEventListener('input', () => {
            this.email = this._emailInput.value;
            events.emit('contacts.email:change', { 
                email: this._emailInput.value
            });
        });

        this._phoneInput.addEventListener('input', () => {
            this.phone = this._phoneInput.value;
            events.emit('contacts.phone:change', { 
                phone: this._phoneInput.value
            });
        });
    }

    set email(value: string) {
        this._emailInput.value = value;
    }

    set phone(value: string) {
        this._phoneInput.value = value;
    }

    render(data: IContacts): HTMLElement {
        super.render(data);
        this.email = data.email;
        this.phone = data.phone;
        this.errors = data.errors;
        this.valid = data.valid;
        return this.container;
    }
}