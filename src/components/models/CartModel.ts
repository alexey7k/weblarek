import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class CartModel {
    private items: IProduct[] = [];

    constructor(private events: EventEmitter) {}

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(item: IProduct): void {
        // Проверяем, нет ли уже товара с таким ID в корзине
        if (!this.isItemInCart(item.id)) {
            this.items.push(item);
            this.events.emit('cart:changed', { items: this.items });
        }
    }

    removeItem(id: string): void {
        this.items = this.items.filter(item => item.id !== id);
        this.events.emit('cart:changed', { items: this.items });
    }

    clearCart(): void {
        this.items = [];
        this.events.emit('cart:changed', { items: this.items });
    }

    getTotalPrice(): number {
        return this.items.reduce((total, item) => {
            return item.price !== null ? total + item.price : total;
        }, 0);
    }

    getItemCount(): number {
        return this.items.length;
    }

    isItemInCart(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
}
