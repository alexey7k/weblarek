import { Card } from './Card';
import { ICard } from './Card';
import { ensureElement } from '../../utils/utils';

/**
 * Интерфейс действий карточки в корзине
 * @property {(event: MouseEvent) => void} onClick - Обработчик клика по кнопке удаления
 */
interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

/**
 * Интерфейс данных карточки в корзине
 * @extends ICard
 * @property {number} index - Порядковый номер в корзине
 */
interface ICardBasket extends ICard {
    index: number;
}

/**
 * Класс карточки товара в корзине
 */
export class CardBasket extends Card<ICardBasket> {
    protected _index: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        this._index = ensureElement<HTMLElement>('.basket__item-index', container);
        this._button = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

        if (actions?.onClick) {
            this._button.addEventListener('click', actions.onClick);
        }
    }

    set index(value: number) {
        this.setText(this._index, value.toString());
    }
}