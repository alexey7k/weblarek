import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IProduct } from '../../types';
import { CardBasket } from './CardBasket';
import { cloneTemplate } from '../../utils/utils';

interface IBasket {
    items: IProduct[];
    total: number;
}

interface IBasketActions {
    onClick: () => void;
    onRemove: (id: string) => void;
}

export class Basket extends Component<IBasket> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, private actions: IBasketActions) {
        super(container);
        this._list = ensureElement<HTMLElement>('.basket__list', container);
        this._total = ensureElement<HTMLElement>('.basket__price', container);
        this._button = ensureElement<HTMLButtonElement>('.basket__button', container);
        this._button.addEventListener('click', () => this.actions.onClick());
    }

    set items(items: IProduct[]) {
        if (items.length === 0) {
            // Создаем элемент для отображения сообщения о пустой корзине
            const emptyMessage = document.createElement('ol');
            emptyMessage.classList.add('basket__item', 'basket__item_empty');
            emptyMessage.textContent = 'Корзина пуста';
            emptyMessage.style.color = '#999';
            emptyMessage.style.opacity = '0.7';
            emptyMessage.style.border = 'transparent';
            this._list.innerHTML = '';
            this._list.appendChild(emptyMessage);
        } else {
            this._list.innerHTML = '';
            items.forEach((item, index) => {
                const card = new CardBasket(cloneTemplate<HTMLElement>('#card-basket'), {
                    onClick: () => this.actions.onRemove(item.id)
                });
                
                card.render({
                    id: item.id,
                    title: item.title,
                    price: item.price,
                    index: index + 1
                });
                
                this._list.append(card.container);
            });
        }
    }

    set total(value: number) {
        this.setText(this._total, `${value} синапсов`);
    }

    set buttonDisabled(value: boolean) {
        this._button.disabled = value;
    }

    render(data: IBasket): HTMLElement {
        super.render(data);
        this.items = data.items;
        this.total = data.total;
        this.buttonDisabled = data.items.length === 0;
        return this.container;
    }
}