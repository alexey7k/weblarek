import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

/**
 * Интерфейс для данных успешного заказа
 * @property {number} total - Сумма списания синапсов
 */
interface ISuccess {
    total: number;
}

/**
 * Интерфейс для действий успешного заказа
 * @property {() => void} onClick - Обработчик клика по кнопке закрытия
 */
interface ISuccessActions {
    onClick: () => void;
}

/**
 * Класс компонента успешного оформления заказа
 * Управляет отображением информации о заказе и обработкой закрытия
 */
export class Success extends Component<ISuccess> {
    protected _close: HTMLElement;
    protected _total: HTMLElement;

    /**
     * Создает экземпляр компонента успешного заказа
     * @param {HTMLElement} container - Родительский контейнер для компонента
     * @param {ISuccessActions} actions - Объект с обработчиками действий
     */
    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);

        this._close = ensureElement<HTMLElement>('.order-success__close', this.container);
        this._total = ensureElement<HTMLElement>('.order-success__description', this.container);

        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }

    /**
     * Устанавливает сумму списания синапсов
     * @param {number} value - Сумма списания
     */
    set total(value: number) {
        this.setText(this._total, `Списано ${value} синапсов`);
    }
}