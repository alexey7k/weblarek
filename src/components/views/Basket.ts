import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IProduct } from '../../types';
import { CardBasket } from './CardBasket';
import { cloneTemplate } from '../../utils/utils';

/**
 * Интерфейс данных корзины
 * @property {IProduct[]} items - Товары в корзине
 * @property {number} total - Общая стоимость
 */
interface IBasket {
    items: IProduct[];
    total: number;
}

/**
 * Интерфейс действий корзины
 * @property {() => void} onClick - Обработчик клика по кнопке оформления
 * @property {(index: number) => void} onRemove - Обработчик удаления товара по индексу
 */
interface IBasketActions {
    onClick: () => void;
    onRemove: (index: number) => void;
}

/**
 * Класс корзины товаров
 */
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
        this._list.innerHTML = '';
        items.forEach((item, index) => {
            const card = new CardBasket(cloneTemplate<HTMLElement>('#card-basket'), {
                onClick: () => this.actions.onRemove(index) // Передаем индекс вместо ID
            });
            
            // Передаем только необходимые данные для карточки корзины
            card.render({
                id: item.id,
                title: item.title,
                price: item.price,
                index: index + 1
            });
            
            this._list.append(card.container);
        });
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


// import { Component } from '../base/Component';
// import { ensureElement } from '../../utils/utils';
// import { IProduct } from '../../types';
// import { CardBasket } from './CardBasket';
// import { cloneTemplate } from '../../utils/utils';

// /**
//  * Интерфейс данных корзины
//  * @property {IProduct[]} items - Товары в корзине
//  * @property {number} total - Общая стоимость
//  */
// interface IBasket {
//     items: IProduct[];
//     total: number;
// }

// /**
//  * Интерфейс действий корзины
//  * @property {() => void} onClick - Обработчик клика по кнопке оформления
//  * @property {(id: string) => void} onRemove - Обработчик удаления товара
//  */
// interface IBasketActions {
//     onClick: () => void;
//     onRemove: (id: string) => void;
// }

// /**
//  * Класс корзины товаров
//  */
// export class Basket extends Component<IBasket> {
//     protected _list: HTMLElement;
//     protected _total: HTMLElement;
//     protected _button: HTMLButtonElement;

//     constructor(container: HTMLElement, private actions: IBasketActions) {
//         super(container);
//         this._list = ensureElement<HTMLElement>('.basket__list', container);
//         this._total = ensureElement<HTMLElement>('.basket__price', container);
//         this._button = ensureElement<HTMLButtonElement>('.basket__button', container);

//         this._button.addEventListener('click', () => this.actions.onClick());
//     }

//     set items(items: IProduct[]) {
//         this._list.innerHTML = '';
//         items.forEach((item, index) => {
//             const card = new CardBasket(cloneTemplate<HTMLElement>('#card-basket'), {
//                 onClick: () => this.actions.onRemove(item.id)
//             });
            
//             // Передаем только необходимые данные для карточки корзины
//             card.render({
//                 id: item.id,
//                 title: item.title,
//                 price: item.price,
//                 index: index + 1
//             });
            
//             this._list.append(card.container);
//         });
//     }

//     set total(value: number) {
//         this.setText(this._total, `${value} синапсов`);
//     }

//     set buttonDisabled(value: boolean) {
//         this._button.disabled = value;
//     }

//     render(data: IBasket): HTMLElement {
//         super.render(data);
//         this.items = data.items;
//         this.total = data.total;
//         this.buttonDisabled = data.items.length === 0;
//         return this.container;
//     }
// }