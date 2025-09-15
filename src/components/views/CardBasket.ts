import { Card } from './Card';
import { ICard } from './Card';
import { ensureElement } from '../../utils/utils';

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

interface ICardBasket extends ICard {
    index: number;
}

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

    render(data: ICardBasket): HTMLElement {
        this.index = data.index;
        this.title = data.title;
        this.price = data.price;
        return this.container;
    }
}