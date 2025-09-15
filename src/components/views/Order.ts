import { Form } from './Form';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/Events';

interface IOrder {
    address: string;
    payment: string;
    errors: string;
}

export class Order extends Form<IOrder> {
    protected _paymentButtons: HTMLButtonElement[];
    protected _addressInput: HTMLInputElement;
    protected _errors: HTMLElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._paymentButtons = Array.from(container.querySelectorAll('button[name]'));
        this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);
        this._errors = ensureElement<HTMLElement>('.form__errors', container);

        this._paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.payment = button.name;
                events.emit('order.payment:change', { payment: button.name });
                this.validateForm();
            });
        });

        this._addressInput.addEventListener('input', () => {
            this.address = this._addressInput.value;
            events.emit('order.address:change', { address: this._addressInput.value });
            this.validateForm();
        });
    }

    set payment(value: string) {
        this._paymentButtons.forEach(button => {
            button.classList.toggle('button_alt-active', button.name === value);
        });
    }

    set address(value: string) {
        this._addressInput.value = value;
    }

    set errors(value: string) {
        this.setText(this._errors, value);
    }

    isValid(): boolean {
        const hasPayment = this._paymentButtons.some(button => 
            button.classList.contains('button_alt-active')
        );
        const hasAddress = this._addressInput.value.trim().length > 0;
        return hasPayment && hasAddress;
    }

    private validateForm() {
        const hasPayment = this._paymentButtons.some(button => 
            button.classList.contains('button_alt-active')
        );
        const hasAddress = this._addressInput.value.trim().length > 0;

        if (!hasPayment && !hasAddress) {
            this.errors = 'Выберите способ оплаты и укажите адрес';
            this.valid = false;
        } else if (!hasPayment) {
            this.errors = 'Выберите способ оплаты';
            this.valid = false;
        } else if (!hasAddress) {
            this.errors = 'Необходимо указать адрес';
            this.valid = false;
        } else {
            this.errors = '';
            this.valid = true;
        }
    }

    render(data: IOrder): HTMLElement {
        super.render(data);
        this.payment = data.payment;
        this.address = data.address;
        this.errors = data.errors || '';
        this.validateForm();
        return this.container;
    }
}