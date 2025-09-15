import { Component } from '../base/Component';
import { IProduct } from '../../types';
import { CardCatalog } from './CardCatalog';
import { cloneTemplate, replaceExtensionToPng } from '../../utils/utils';
import { CDN_URL } from '../../utils/constants';

interface IGalleryActions {
    onClick: (item: IProduct) => void;
}

export class Gallery extends Component<IProduct[]> {
    protected _cards: HTMLElement[];

    constructor(container: HTMLElement, private actions: IGalleryActions) {
        super(container);
        this._cards = [];
    }

    render(items: IProduct[]): HTMLElement {
        super.render();
        this.container.innerHTML = '';
        this._cards = items.map((item, index) => {
            const card = new CardCatalog(cloneTemplate<HTMLElement>('#card-catalog'));
            
            // Формируем полный URL для изображения
            const imageUrl = item.image ? 
            `${CDN_URL}/${replaceExtensionToPng(item.image)}` : '';
            
            card.render({
                ...item,
                title: item.title,
                image: imageUrl,
                category: item.category,
                price: item.price
            });
            
            card.container.addEventListener('click', () => this.actions.onClick(item));
            this.container.append(card.container);
            return card.container;
        });
        return this.container;
    }
}
