import { Card } from './Card';
import { ICard } from './Card';
import { ensureElement } from '../../utils/utils';

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export class CardPreview extends Card<ICard> {
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;
    protected _isInCart: boolean = false;
    protected _hasPrice: boolean = true;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        this._description = ensureElement<HTMLElement>('.card__text', container);
        this._button = ensureElement<HTMLButtonElement>('.card__button', container);

        if (actions?.onClick) {
            this._button.addEventListener('click', actions.onClick);
        }
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    set buttonText(value: string) {
        this.setText(this._button, value);
    }

    set buttonDisabled(value: boolean) {
        this._button.disabled = value;
    }

    set isInCart(value: boolean) {
        this._isInCart = value;
        this.updateButtonState();
    }

    set hasPrice(value: boolean) {
        this._hasPrice = value;
        this.updateButtonState();
    }

    private updateButtonState() {
        if (!this._hasPrice) {
            // Если у товара нет цены, всегда показываем "Недоступно"
            this.buttonText = 'Недоступно';
            this.buttonDisabled = true;
        } else if (this._isInCart) {
            // Если товар в корзине и есть цена, показываем "Удалить из корзины"
            this.buttonText = 'Удалить из корзины';
            this.buttonDisabled = false;
        } else {
            // Если товара нет в корзине и есть цена, показываем "Купить"
            this.buttonText = 'Купить';
            this.buttonDisabled = false;
        }
    }

    render(data: ICard): HTMLElement {
        super.render(data);
        this.hasPrice = data.price !== null;
        return this.container;
    }
}
