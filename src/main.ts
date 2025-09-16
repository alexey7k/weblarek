import './scss/styles.scss';

import { Api } from './components/base/Api';
import { ApiClient } from './components/api/ApiClient';
import { CatalogModel } from './components/models/CatalogModel';
import { CartModel } from './components/models/CartModel';
import { CustomerDataModel } from './components/models/CustomerDataModel';
import { Gallery } from './components/views/Gallery';
import { CardPreview } from './components/views/CardPreview';
import { Basket } from './components/views/Basket';
import { Order } from './components/views/Order';
import { Contacts } from './components/views/Contacts';
import { Header } from './components/views/Header';
import { Modal } from './components/views/Modal';
import { Success } from './components/views/Success';
import { EventEmitter } from './components/base/Events';
import { API_URL, CDN_URL } from './utils/constants';
import { ensureElement, cloneTemplate, replaceExtensionToPng } from './utils/utils';
import { IProduct, IOrderData, IOrderResult, IBuyer, ICatalogChangedEvent, ICartChangedEvent, IItemSelectedEvent, } from './types';

// Инициализация событий
const events = new EventEmitter();

// Инициализация API
const api = new Api(API_URL);
const apiClient = new ApiClient(api);

// Инициализация моделей
const catalogModel = new CatalogModel(events);
const cartModel = new CartModel(events);
const customerModel = new CustomerDataModel(events);

// Находим элементы DOM
const galleryContainer = ensureElement<HTMLElement>('.gallery');
const headerContainer = ensureElement<HTMLElement>('.header');
const modalContainer = ensureElement<HTMLElement>('#modal-container');

// Создаем компоненты представления
const header = new Header(events, headerContainer);
const modal = new Modal(modalContainer, events);
const gallery = new Gallery(galleryContainer, {
    onClick: (item: IProduct) => {
        catalogModel.setSelectedItem(item);
    }
});

// Переменные для отслеживания текущих представлений
let currentPreview: CardPreview | null = null;
let currentOrderForm: Order | null = null;
let currentContactsForm: Contacts | null = null;
let currentModal: string | null = null;

// Создаем компоненты для модальных окон
const basketTemplate = cloneTemplate<HTMLElement>('#basket');
const basket = new Basket(basketTemplate, {
    onClick: () => {
        // Переход к оформлению заказа
        currentModal = 'order';
        currentOrderForm = new Order(cloneTemplate<HTMLFormElement>('#order'), events);
        const customerData = customerModel.getCustomerData();
        const orderFormElement = currentOrderForm.render({
        address: customerData.address,
        payment: customerData.payment,
        errors: ''
    });
    modal.content = orderFormElement;
    },

    onRemove: (id: string) => {
    cartModel.removeItem(id);
    }
});

const successTemplate = cloneTemplate<HTMLElement>('#success');
const success = new Success(successTemplate, {
     onClick: () => {
         modal.close();
     }
 });

// Обработчики событий

// Загрузка каталога товаров
events.on('catalog:changed', (data: ICatalogChangedEvent) => {
    gallery.render(data.items);
});

// Выбор товара для просмотра
events.on('catalog:item-selected', (data: IItemSelectedEvent) => {
    currentModal = 'preview';
    const isInCart = cartModel.isItemInCart(data.item.id);
    const hasPrice = data.item.price !== null;
    
    currentPreview = new CardPreview(cloneTemplate<HTMLElement>('#card-preview'), {
        onClick: () => {
            if (hasPrice) {
                if (isInCart) {
                    cartModel.removeItem(data.item.id);
                } else {
                    cartModel.addItem(data.item);
                }
            }
            modal.close();
        }
    });

    const imageUrl = data.item.image ? 
        `${CDN_URL}/${replaceExtensionToPng(data.item.image)}` : '';

    const itemData = {
        ...data.item,
        image: imageUrl,
        description: data.item.description || 'Описание отсутствует'
    };
    
    currentPreview.isInCart = isInCart;
    currentPreview.hasPrice = hasPrice;
    
    const previewElement = currentPreview.render(itemData);
    modal.content = previewElement;
    modal.open();
});

// Изменение состояния корзины
events.on('cart:changed', (data: ICartChangedEvent) => {
    header.counter = data.count;
    
    // Обновляем состояние кнопки в превью через представление
    if (currentModal === 'preview' && currentPreview) {
        const selectedItem = catalogModel.getSelectedItem();
        if (selectedItem) {
            const isInCart = cartModel.isItemInCart(selectedItem.id);
            const hasPrice = selectedItem.price !== null;
            currentPreview.isInCart = isInCart;
            currentPreview.hasPrice = hasPrice;
        }
    }
    
    // Обновляем корзину, если она открыта
    if (currentModal === 'basket') {
        const basketElement = basket.render({
            items: data.items,
            total: data.total
        });
        modal.content = basketElement;
    }
});

// Открытие корзины
events.on('basket:open', () => {
    currentModal = 'basket';
    const basketElement = basket.render({
        items: cartModel.getItems(),
        total: cartModel.getTotalPrice()
    });
    modal.content = basketElement;
    modal.open();
});

// Обработка формы заказа
events.on('order:submit', () => {
    const orderErrors = customerModel.getOrderValidationErrors();
    
    if (orderErrors.length === 0) {
        currentModal = 'contacts';
        currentContactsForm = new Contacts(cloneTemplate<HTMLFormElement>('#contacts'), events);
        const customerData = customerModel.getCustomerData();
        const contactsFormElement = currentContactsForm.render({
            email: customerData.email,
            phone: customerData.phone,
            errors: '',
            valid: false
        });
        modal.content = contactsFormElement;
    } else {
        if (currentOrderForm) {
            currentOrderForm.errors = orderErrors.join(', ');
            currentOrderForm.valid = orderErrors.length === 0;
        }
    }
});

// Изменение способа оплаты
events.on('order.payment:change', (data: { payment: string }) => {
    customerModel.setCustomerData({ payment: data.payment });
    const orderErrors = customerModel.getOrderValidationErrors();
    if (currentOrderForm) {
        currentOrderForm.errors = orderErrors.join(', ');
        currentOrderForm.valid = orderErrors.length === 0;
    }
});

// Изменение адреса
events.on('order.address:change', (data: { address: string, validate?: boolean }) => {
    customerModel.setCustomerData({ address: data.address });
    
    // Проверяем валидность только если указан флаг validate
    if (data.validate) {
        const orderErrors = customerModel.getOrderValidationErrors();
        if (currentOrderForm) {
            currentOrderForm.errors = orderErrors.join(', ');
            currentOrderForm.valid = orderErrors.length === 0;
        }
    }
});

// Изменение email
events.on('contacts.email:change', (data: { email: string }) => {
    customerModel.setCustomerData({ email: data.email });
    const validationErrors = customerModel.getContactsValidationErrors();
    if (currentContactsForm) {
        currentContactsForm.render({
            email: customerModel.getCustomerData().email,
            phone: customerModel.getCustomerData().phone,
            errors: validationErrors.join(', '),
            valid: validationErrors.length === 0
        });
    }
});

// Изменение телефона
events.on('contacts.phone:change', (data: { phone: string }) => {
    customerModel.setCustomerData({ phone: data.phone });
    const validationErrors = customerModel.getContactsValidationErrors();
    if (currentContactsForm) {
        currentContactsForm.render({
            email: customerModel.getCustomerData().email,
            phone: customerModel.getCustomerData().phone,
            errors: validationErrors.join(', '),
            valid: validationErrors.length === 0
        });
    }
});

// Обработка формы контактов
events.on('contacts:submit', () => {
    // Проверяем валидность данных в модели
    const validationErrors = customerModel.getContactsValidationErrors();
    
    if (validationErrors.length === 0) {
        // Создание заказа
        const orderData: IOrderData = {
            payment: customerModel.getCustomerData().payment as 'card' | 'cash',
            email: customerModel.getCustomerData().email,
            phone: customerModel.getCustomerData().phone,
            address: customerModel.getCustomerData().address,
            total: cartModel.getTotalPrice(),
            items: cartModel.getItems().map(item => item.id)
        };
        
        apiClient.createOrder(orderData)
            .then((result: IOrderResult) => {
                currentModal = 'success';
                // Показ успешного оформления заказа
                const successElement = success.render({ total: result.total });
                modal.content = successElement;
                
                // Очистка корзины и данных покупателя
                cartModel.clearCart();
                customerModel.clearCustomerData();
            })
            .catch(error => {
                console.error('Ошибка оформления заказа:', error);
                currentContactsForm = new Contacts(cloneTemplate<HTMLFormElement>('#contacts'), events);
                const customerData = customerModel.getCustomerData();
                const contactsFormElement = currentContactsForm.render({
                    email: customerData.email,
                    phone: customerData.phone,
                    errors: 'Ошибка оформления заказа. Попробуйте еще раз.',
                    valid: false
                });
                modal.content = contactsFormElement;
            });
        } else {
            // Если данные не валидны, показываем ошибки из модели
            currentContactsForm = new Contacts(cloneTemplate<HTMLFormElement>('#contacts'), events);
            const customerData = customerModel.getCustomerData();
            const contactsFormElement = currentContactsForm.render({
                email: customerData.email,
                phone: customerData.phone,
                errors: validationErrors.join(', '),
                valid: false
            });
            modal.content = contactsFormElement;
        }
});

// Закрытие модального окна
events.on('modal:close', () => {
    currentModal = null;
    currentPreview = null;
    currentOrderForm = null;
    currentContactsForm = null;
});

// Инициализация приложения
function initApp() {
    // Загрузка товаров с API
    apiClient.getItems()
        .then(items => {
            catalogModel.setItems(items);
        })
        .catch(error => {
            console.error('Ошибка загрузки товаров:', error);
        });
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', initApp);