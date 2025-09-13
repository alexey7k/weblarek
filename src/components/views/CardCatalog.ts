import { Card } from './Card';
import { ICard } from './Card';

/**
 * Класс карточки товара в каталоге
 */
export class CardCatalog extends Card<ICard> {
    constructor(container: HTMLElement) {
        super(container);
    }

    render(data: ICard): HTMLElement {
        super.render(data);
        return this.container;
    }
}