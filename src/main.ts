import './scss/styles.scss';

import { CatalogModel } from './components/models/CatalogModel';
import { CartModel } from './components/models/CartModel';
import { CustomerDataModel } from './components/models/CustomerDataModel';
import { apiProducts } from './utils/data';
import { Api } from './components/base/Api';
import { ApiClient } from './components/api/ApiClient';
import { API_URL } from './utils/constants';

// Создание экземпляра каталога
const catalogModel = new CatalogModel();

// Сохранение товаров в каталог
catalogModel.setItems(apiProducts.items);

// Проверка работы методов
console.log('Массив товаров из каталога:', catalogModel.getItems());
console.log('Количество товаров в каталоге:', catalogModel.getItems().length);

// Дополнительные проверки
const firstProduct = catalogModel.getItems()[0];
if (firstProduct) {
    console.log('Первый товар в каталоге:', firstProduct);
    
    // Проверка поиска по ID
    const foundProduct = catalogModel.getItemById(firstProduct.id);
    console.log('Найденный товар по ID:', foundProduct);
    
    // Проверка установки выбранного товара
    catalogModel.setSelectedItem(firstProduct);
    console.log('Выбранный товар:', catalogModel.getSelectedItem());
}

// Создание корзины товаров
const cartModel = new CartModel();

// Добавляем несколько товаров
cartModel.addItem(apiProducts.items[0]);
cartModel.addItem(apiProducts.items[2]);
cartModel.addItem(apiProducts.items[3]);

// Показать товары в корзине
console.log('Товары в корзине:', cartModel.getItems());

// Количество товаров в корзине
console.log('Количество товаров в корзине:', cartModel.getItemCount());

// Проверка общей стоимости
console.log('Общая стоимость товаров в корзине:', cartModel.getTotalPrice());

// Проверка наличия товара в корзине
const testItemId = apiProducts.items[0].id;
console.log(`Товар с ID ${testItemId} в корзине:`, cartModel.isItemInCart(testItemId));

// Удаление одного товара из корзины
console.log('\n--- Удаление товара из корзины ---');
console.log('Удаляем товар с ID:', testItemId);
cartModel.removeItem(testItemId);

// Проверка после удаления
console.log('Товары в корзине после удаления:', cartModel.getItems());
console.log('Количество товаров после удаления:', cartModel.getItemCount());
console.log('Общая стоимость после удаления:', cartModel.getTotalPrice());
console.log(`Товар с ID ${testItemId} в корзине:`, cartModel.isItemInCart(testItemId));

// Тестирование очистки корзины
console.log('\n--- Очистка корзины ---');
cartModel.clearCart();
console.log('Товары в корзине после очистки:', cartModel.getItems());
console.log('Количество товаров после очистки:', cartModel.getItemCount());
console.log('Общая стоимость после очистки:', cartModel.getTotalPrice());

// Создание данных о покупателе
const customerDataModel = new CustomerDataModel();

// Передаем данные о первом покупателе
const firstCustomerDataModel = {
    payment: 'card' as const,
    address: 'ул. Ленина, д. 1',
    email: 'example@mail.ru',
    phone: '+7 (909) 999-88-77'
};
customerDataModel.setCustomerData(firstCustomerDataModel);

//Показываем данные первого покупателя
console.log('Данные первого покупателя:', customerDataModel.getCustomerData());

// Проверка валидации первого покупателя
console.log('Валидация данных первого покупателя:', customerDataModel.validateData());

// Передаем данные о втором покупателе
const secondCustomerDataModel = {
    payment: 'card' as const,
    address: 'Сущевск',
    email: 'ул. Ленина, д. 1',
    phone: '911'
};
customerDataModel.setCustomerData(secondCustomerDataModel);

//Показываем данные второго покупателя
console.log('Данные о втором покупателе:', customerDataModel.getCustomerData());

// Проверка валидации второго покупателя
console.log('Валидация данных второго покупателя:', customerDataModel.validateData());
console.log('Валидация оплаты:', customerDataModel.validatePayment());
console.log('Валидация адреса:', customerDataModel.validateAddress());
console.log('Валидация email:', customerDataModel.validateEmail());
console.log('Валидация телефона:', customerDataModel.validatePhone());

console.log('\n=== ЗАПРОС К СЕРВЕРУ ДЛЯ ПОЛУЧЕНИЯ КАТАЛОГА ===');

// Создание экземпляра Api и ApiClient
const api = new Api(API_URL);
const apiClient = new ApiClient(api);

// Выполнение запроса на сервер для получения каталога товаров
try {
    const itemsFromServer = await apiClient.getItems();
    
    // Сохранение полученных товаров в модель каталога
    catalogModel.setItems(itemsFromServer);
    
    // Вывод результатов в консоль для проверки
    console.log('Товары успешно получены с сервера!');
    console.log('Количество товаров:', catalogModel.getItems().length);
    console.log('Массив товаров из сервера:', catalogModel.getItems());
    
    // Дополнительная проверка работы методов с данными с сервера
    if (catalogModel.getItems().length > 0) {
        const serverProduct = catalogModel.getItems()[0];
        console.log('Первый товар с сервера:', serverProduct);
        
        const foundServerProduct = catalogModel.getItemById(serverProduct.id);
        console.log('Найденный товар по ID с сервера:', foundServerProduct);
    }
    
} catch (error) {
    console.error('Печаль! Ошибка при получении данных с сервера:', error);
}
