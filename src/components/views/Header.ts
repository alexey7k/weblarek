import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

/**
 * Интерфейс для данных хедера
 * @property {number} counter - Количество товаров в корзине
 */
interface IHeader {
    counter: number;
}

/**
 * Класс компонента хедера страницы
 * Управляет отображением счетчика корзины и обработкой кликов по кнопке корзины
 */
export class Header extends Component<IHeader> {
    protected counterElement: HTMLElement;
    protected basketButton: HTMLButtonElement;

    /**
     * Создает экземпляр компонента хедера
     * @param {IEvents} events - Объект для работы с событиями
     * @param {HTMLElement} container - Родительский контейнер для компонента
     */
    constructor(protected events: IEvents, container: HTMLElement) {
        super(container);
        
        this.counterElement = ensureElement<HTMLElement>(
            '.header__basket-counter', 
            this.container
        );
        
        this.basketButton = ensureElement<HTMLButtonElement>(
            '.header__basket', 
            this.container
        );

        this.basketButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    /**
     * Устанавливает значение счетчика корзины
     * @param {number} value - Количество товаров в корзине
     */
    set counter(value: number) {
        this.counterElement.textContent = String(value);
    }
}