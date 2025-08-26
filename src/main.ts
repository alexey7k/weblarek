import './scss/styles.scss';

import { Catalog } from './components/models/Catalog';
import { Cart } from './components/models/Cart';
import { CustomerData } from './components/models/CustomerData';
import { apiProducts } from './utils/data';
import { Api } from './components/base/Api';
import { ApiClient } from './components/api/ApiClient';
import { API_URL } from './utils/constants';

// Создание экземпляра каталога
const catalog = new Catalog();

// Сохранение товаров в каталог
catalog.setItems(apiProducts.items);

// Проверка работы методов
console.log('Массив товаров из каталога:', catalog.getItems());
console.log('Количество товаров в каталоге:', catalog.getItems().length);

// Дополнительные проверки
const firstProduct = catalog.getItems()[0];
if (firstProduct) {
    console.log('Первый товар в каталоге:', firstProduct);
    
    // Проверка поиска по ID
    const foundProduct = catalog.getItemById(firstProduct.id);
    console.log('Найденный товар по ID:', foundProduct);
    
    // Проверка установки выбранного товара
    catalog.setSelectedItem(firstProduct);
    console.log('Выбранный товар:', catalog.getSelectedItem());
}

// Создание корзины товаров
const cart = new Cart();

// Добавление товара в корзину
cart.addItem(apiProducts.items[1]);
cart.addItem(apiProducts.items[3]);

// Показать товары в корзине
console.log('Массив товаров в корзине:', cart.getItems());

// Количество товаров в корзине
console.log('Количество товаров в корзине:', cart.getItemCount());

// Создание данных о покупателе
const customerData = new CustomerData();

// Передаем данные о первом покупателе
const firstCustomerData = {
    payment: 'card' as const,
    address: 'ул. Ленина, д. 1',
    email: 'example@mail.ru',
    phone: '+7 (909) 999-88-77'
};
customerData.setCustomerData(firstCustomerData);

//Показываем данные первого покупателя
console.log('Данные первого покупателя:', customerData.getCustomerData());

// Проверка валидации первого покупателя
console.log('Валидация данных первого покупателя:', customerData.validateData());

// Передаем данные о втором покупателе
const secondCustomerData = {
    payment: 'card' as const,
    address: 'Сущевск',
    email: 'ул. Ленина, д. 1',
    phone: '911'
};
customerData.setCustomerData(secondCustomerData);

//Показываем данные второго покупателя
console.log('Данные о втором покупателе:', customerData.getCustomerData());

// Проверка валидации второго покупателя
console.log('Валидация данных второго покупателя:', customerData.validateData());
console.log('Валидация оплаты:', customerData.validatePayment());
console.log('Валидация адреса:', customerData.validateAddress());
console.log('Валидация email:', customerData.validateEmail());
console.log('Валидация телефона:', customerData.validatePhone());

console.log('\n=== ЗАПРОС К СЕРВЕРУ ДЛЯ ПОЛУЧЕНИЯ КАТАЛОГА ===');

// Создание экземпляра Api и ApiClient
const api = new Api(API_URL);
const apiClient = new ApiClient(api);

// Выполнение запроса на сервер для получения каталога товаров
try {
    const itemsFromServer = await apiClient.getItems();
    
    // Сохранение полученных товаров в модель каталога
    catalog.setItems(itemsFromServer);
    
    // Вывод результатов в консоль для проверки
    console.log('Товары успешно получены с сервера!');
    console.log('Количество товаров:', catalog.getItems().length);
    console.log('Массив товаров из сервера:', catalog.getItems());
    
    // Дополнительная проверка работы методов с данными с сервера
    if (catalog.getItems().length > 0) {
        const serverProduct = catalog.getItems()[0];
        console.log('Первый товар с сервера:', serverProduct);
        
        const foundServerProduct = catalog.getItemById(serverProduct.id);
        console.log('Найденный товар по ID с сервера:', foundServerProduct);
    }
    
} catch (error) {
    console.error('Печаль! Ошибка при получении данных с сервера:', error);
}
