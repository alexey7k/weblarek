import { Card } from './Card';
import { ICard } from './Card';
import { ensureElement } from '../../utils/utils';

/**
 * Интерфейс действий карточки превью
 * @property {(event: MouseEvent) => void} onClick - Обработчик клика по кнопке
 */
interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

/**
 * Класс карточки товара в модальном окне
 */
export class CardPreview extends Card<ICard> {
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;

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

    render(data: ICard): HTMLElement {
        super.render(data);
        
        // Проверяем, является ли товар "бесценным"
        if (data.price === null) {
            this.buttonText = 'Недоступно';
            this.buttonDisabled = true;
        } else {
            this.buttonText = 'В корзину';
            this.buttonDisabled = false;
        }
        
        return this.container;
    }
}


// import { Card } from './Card';
// import { ICard } from './Card';
// import { ensureElement } from '../../utils/utils';

// /**
//  * Интерфейс действий карточки превью
//  * @property {(event: MouseEvent) => void} onClick - Обработчик клика по кнопке
//  */
// interface ICardActions {
//     onClick: (event: MouseEvent) => void;
// }

// /**
//  * Класс карточки товара в модальном окне
//  */
// export class CardPreview extends Card<ICard> {
//     protected _description: HTMLElement;
//     protected _button: HTMLButtonElement;

//     constructor(container: HTMLElement, actions?: ICardActions) {
//         super(container);
//         this._description = ensureElement<HTMLElement>('.card__text', container);
//         this._button = ensureElement<HTMLButtonElement>('.card__button', container);

//         if (actions?.onClick) {
//             this._button.addEventListener('click', actions.onClick);
//         }
//     }

//     set description(value: string) {
//         this.setText(this._description, value);
//     }

//     set buttonText(value: string) {
//         this.setText(this._button, value);
//     }

//     render(data: ICard): HTMLElement {
//         super.render(data);
//         return this.container;
//     }
// }