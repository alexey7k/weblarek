import { IProduct } from '../../types';

export class Cart {
    private items: IProduct[] = [];

    getItems(): IProduct[] {
        return this.items;
    }

    addItem(item: IProduct): void {
        this.items.push(item);
    }

    removeItem(id: string): void {
        this.items = this.items.filter(item => item.id !== id);
    }

    clearCart(): void {
        this.items = [];
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