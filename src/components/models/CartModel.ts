import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class CartModel {
    private items: IProduct[] = [];

    constructor(private events: EventEmitter) {}

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(item: IProduct): void {
        if (!this.isItemInCart(item.id)) {
            this.items.push(item);
            this.emitCartChanged();
        }
    }

    removeItem(id: string): void {
        this.items = this.items.filter(item => item.id !== id);
        this.emitCartChanged();
    }

    clearCart(): void {
        this.items = [];
        this.emitCartChanged();
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

    private emitCartChanged(): void {
        this.events.emit('cart:changed', {
            items: this.items,
            total: this.getTotalPrice(),
            count: this.getItemCount()
        });
    }
}