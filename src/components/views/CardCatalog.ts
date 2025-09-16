import { Card } from './Card';
import { ICard } from './Card';

/**
 * Интерфейс действий карточки каталога
 * @property {() => void} onClick - Обработчик клика по карточке
 */
interface ICardActions {
    onClick: () => void;
}

/**
 * Класс карточки товара в каталоге
 */
export class CardCatalog extends Card<ICard> {
    constructor(container: HTMLElement, protected actions?: ICardActions) {
        super(container);
        
        if (actions?.onClick) {
            this.container.addEventListener('click', actions.onClick);
        }
    }
}