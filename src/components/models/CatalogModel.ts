import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class CatalogModel {
    private items: IProduct[] = [];
    private selectedItem: IProduct | null = null;

    constructor(private events: EventEmitter) {}

    setItems(items: IProduct[]): void {
        this.items = items;
        this.events.emit('catalog:changed', { items: this.items });
    }

    getItems(): IProduct[] {
        return this.items;
    }

    getItemById(id: string): IProduct | undefined {
        return this.items.find(item => item.id === id);
    }

    setSelectedItem(item: IProduct): void {
        this.selectedItem = item;
        this.events.emit('catalog:item-selected', { item: this.selectedItem });
    }

    getSelectedItem(): IProduct | null {
        return this.selectedItem;
    }
}