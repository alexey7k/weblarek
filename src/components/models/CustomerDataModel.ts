import { IBuyer } from '../../types';
import { EventEmitter } from '../base/Events';
import { validateEmail, validatePhone } from '../../utils/utils';

export class CustomerDataModel {
    private payment: 'card' | 'cash' | '' = '';
    private address: string = '';
    private email: string = '';
    private phone: string = '';

    constructor(private events: EventEmitter) {}

    setCustomerData(data: Partial<IBuyer>): void {
        if (data.payment !== undefined) this.payment = data.payment;
        if (data.address !== undefined) this.address = data.address;
        if (data.email !== undefined) this.email = data.email;
        if (data.phone !== undefined) this.phone = data.phone;
        
        this.events.emit('customer:changed', this.getCustomerData());
    }

    getCustomerData(): IBuyer {
        return {
            payment: this.payment,
            address: this.address,
            email: this.email,
            phone: this.phone
        };
    }

    clearCustomerData(): void {
        this.payment = '';
        this.address = '';
        this.email = '';
        this.phone = '';
        this.events.emit('customer:changed', this.getCustomerData());
    }

    validatePayment(): boolean {
        return this.payment === 'card' || this.payment === 'cash';
    }

    validateAddress(): boolean {
        return this.address.trim().length > 0;
    }

    validateEmail(): boolean {
        return validateEmail(this.email);
    }

    validatePhone(): boolean {
        return validatePhone(this.phone);
    }

    getOrderValidationErrors(): string[] {
        const errors: string[] = [];
        
        if (!this.validatePayment()) {
            errors.push('Выберите способ оплаты');
        }
        
        if (!this.validateAddress()) {
            errors.push('Необходимо указать адрес');
        }
        
        return errors;
    }

    getContactsValidationErrors(): string[] {
        const errors: string[] = [];
        
        if (!this.validateEmail()) {
            errors.push('Введите корректный email');
        }
        
        if (!this.validatePhone()) {
            errors.push('Введите корректный телефон');
        }
        
        return errors;
    }
}