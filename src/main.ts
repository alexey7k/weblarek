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
import { IProduct, IOrderData, IOrderResult } from './types';

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

// Создаем компоненты для модальных окон
const basketTemplate = cloneTemplate<HTMLElement>('#basket');
const basket = new Basket(basketTemplate, {
    onClick: () => {
        // Переход к оформлению заказа
        const orderForm = new Order(cloneTemplate<HTMLFormElement>('#order'), events);
        modal.content = orderForm.render(customerModel.getCustomerData());
    },
    onRemove: (index: number) => {
        cartModel.removeItemByIndex(index); // Удаляем по индексу
    }
});


const success = new Success(cloneTemplate<HTMLElement>('#success'), {
     onClick: () => {
         modal.close();
     }
 });

// Переменная для отслеживания открытого модального окна
let currentModal: string | null = null;

// Обработчики событий

// Загрузка каталога товаров
events.on('catalog:changed', () => {
    gallery.render(catalogModel.getItems());
});

// Выбор товара для просмотра
events.on('catalog:item-selected', (data: { item: IProduct }) => {
    currentModal = 'preview';
    const preview = new CardPreview(cloneTemplate<HTMLElement>('#card-preview'), {
        onClick: () => {
            // Для товаров с ценой "бесценно" не добавляем в корзину
            if (data.item.price !== null) {
                cartModel.addItem(data.item);
                modal.close();
            }
        }
    });

    // Меняем расширение изображения на png
    const imageUrl = data.item.image ? 
        `${CDN_URL}/${replaceExtensionToPng(data.item.image)}` : '';

    const itemData = {
        ...data.item,
        image: imageUrl,
        description: data.item.description || 'Описание отсутствует'
    };
    
    modal.content = preview.render(itemData);
    modal.open();
});

// Изменение состояния корзины
events.on('cart:changed', () => {
    header.counter = cartModel.getItemCount();
    
    // Обновляем состояние кнопки в превью, если превью открыто
    const selectedItem = catalogModel.getSelectedItem();
    if (selectedItem && currentModal === 'preview') {
        const isInCart = cartModel.isItemInCart(selectedItem.id);
        const preview = modal.container.querySelector('.card_preview');
        if (preview) {
            const button = preview.querySelector('.card__button');
            if (button) {
                button.textContent = isInCart ? 'Уже в корзине' : 'В корзину';
                (button as HTMLButtonElement).disabled = isInCart;
            }
        }
    }
    
    // Обновляем корзину, если она открыта
    if (currentModal === 'basket') {
        basket.render({
            items: cartModel.getItems(),
            total: cartModel.getTotalPrice()
        });
        modal.content = basket.container;
    }
});

// Открытие корзины
events.on('basket:open', () => {
    currentModal = 'basket';
    basket.render({
        items: cartModel.getItems(),
        total: cartModel.getTotalPrice()
    });
    modal.content = basket.container;
    modal.open();
});

// Обработка формы заказа
events.on('order:submit', () => {
    // Проверяем валидность данных в модели
    if (customerModel.validatePayment() && customerModel.validateAddress()) {
        currentModal = 'contacts';
        const contactsForm = new Contacts(cloneTemplate<HTMLFormElement>('#contacts'), events);
        modal.content = contactsForm.render(customerModel.getCustomerData());
    } else {
        // Если данные не валидны, показываем ошибки
        const orderForm = new Order(cloneTemplate<HTMLFormElement>('#order'), events);
        orderForm.render({
            ...customerModel.getCustomerData(),
            errors: 'Пожалуйста, заполните все поля корректно'
        });
        modal.content = orderForm.container;
    }
});

// Изменение способа оплаты
events.on('order.payment:change', (data: { payment: string }) => {
    customerModel.setCustomerData({ payment: data.payment });
});

// Изменение адреса
events.on('order.address:change', (data: { address: string }) => {
    customerModel.setCustomerData({ address: data.address });
});

// Изменение email
events.on('contacts.email:change', (data: { email: string }) => {
    customerModel.setCustomerData({ email: data.email });
});

// Изменение телефона
events.on('contacts.phone:change', (data: { phone: string }) => {
    customerModel.setCustomerData({ phone: data.phone });
});

// Обработка формы контактов
events.on('contacts:submit', () => {
    // Проверяем валидность данных в модели
    if (customerModel.validateEmail() && customerModel.validatePhone()) {
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
                success.total = result.total;
                modal.content = success.container;
                
                // Очистка корзины и данных покупателя
                cartModel.clearCart();
                customerModel.clearCustomerData();
            })
            .catch(error => {
                console.error('Ошибка оформления заказа:', error);
                // Показать сообщение об ошибке
                const contactsForm = new Contacts(cloneTemplate<HTMLFormElement>('#contacts'), events);
                contactsForm.render({
                    ...customerModel.getCustomerData(),
                    errors: 'Ошибка оформления заказа. Попробуйте еще раз.'
                });
                modal.content = contactsForm.container;
            });
    } else {
        // Если данные не валидны, показываем ошибки
        const contactsForm = new Contacts(cloneTemplate<HTMLFormElement>('#contacts'), events);
        contactsForm.render({
            ...customerModel.getCustomerData(),
            errors: 'Пожалуйста, заполните все поля корректно'
        });
        modal.content = contactsForm.container;
    }
});

// Изменение данных покупателя
events.on('customer:changed', (data: any) => {
    // Обновление состояния кнопок в формах
    const orderForm = modal.container.querySelector('.form_order');
    if (orderForm) {
        const submitButton = orderForm.querySelector('button[type="submit"]');
        if (submitButton) {
            (submitButton as HTMLButtonElement).disabled = !customerModel.validatePayment() || !customerModel.validateAddress();
        }
    }
    
    const contactsForm = modal.container.querySelector('.form_contacts');
    if (contactsForm) {
        const submitButton = contactsForm.querySelector('button[type="submit"]');
        if (submitButton) {
            (submitButton as HTMLButtonElement).disabled = !customerModel.validateEmail() || !customerModel.validatePhone();
        }
    }
});

// Закрытие модального окна
events.on('modal:close', () => {
    currentModal = null;
});

// Валидация формы заказа
events.on('order:validate', () => {
    if (customerModel.validatePayment() && customerModel.validateAddress()) {
        events.emit('order:validated');
    }
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