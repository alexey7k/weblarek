import { Component } from '../base/Component';
import { ensureElementOrNull } from '../../utils/utils';
import { categoryMap } from '../../utils/constants';

export interface ICard {
    id: string;
    title: string;
    image?: string;
    category?: string;
    price: number | null;
    description?: string;
}

export class Card<T> extends Component<T> {
    protected _title: HTMLElement | null;
    protected _image: HTMLImageElement | null;
    protected _category: HTMLElement | null;
    protected _price: HTMLElement | null;

    constructor(container: HTMLElement) {
        super(container);
        this._title = ensureElementOrNull<HTMLElement>('.card__title', container);
        this._image = ensureElementOrNull<HTMLImageElement>('.card__image', container);
        this._category = ensureElementOrNull<HTMLElement>('.card__category', container);
        this._price = ensureElementOrNull<HTMLElement>('.card__price', container);
    }

    set title(value: string) {
        if (this._title) this.setText(this._title, value);
    }

    set image(value: string) {
        if (this._image) this.setImage(this._image, value);
    }

    set category(value: string) {
        if (this._category) {
            this.setText(this._category, value);
            const categoryClass = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
            this._category.className = `card__category ${categoryClass}`;
        }
    }

    set price(value: number | null) {
        if (this._price) this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
    }
}