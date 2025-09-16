import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { CardCatalog } from './CardCatalog';
import { cloneTemplate, replaceExtensionToPng } from '../../utils/utils';
import { CDN_URL } from '../../utils/constants';

/**
 * Интерфейс действий галереи
 * @property {(item: IProduct) => void} onClick - Обработчик клика по карточке
 */
interface IGalleryActions {
    onClick: (item: IProduct) => void;
}

/**
 * Класс галереи товаров
 */
export class Gallery extends Component<IProduct[]> {
    protected _cards: CardCatalog[];

    constructor(container: HTMLElement, private actions: IGalleryActions) {
        super(container);
        this._cards = [];
    }

    render(items: IProduct[]): HTMLElement {
        super.render();
        this.container.innerHTML = '';
        this._cards = items.map((item) => {
            const card = new CardCatalog(cloneTemplate<HTMLElement>('#card-catalog'), {
                onClick: () => this.actions.onClick(item)
            });
            
            // Формируем полный URL для изображения
            const imageUrl = item.image ? 
                `${CDN_URL}/${replaceExtensionToPng(item.image)}` : '';
            
            const cardElement = card.render({
                ...item,
                title: item.title,
                image: imageUrl,
                category: item.category,
                price: item.price
            });
            
            this.container.append(cardElement);
            return card;
        });
        return this.container;
    }
}