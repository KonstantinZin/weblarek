import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { CatalogModel } from './components/models/CatalogModel';
import { CartModel } from './components/models/CartModel';
import { OrderModel } from './components/models/OrderModel';
import { LarekApi } from './components/communicate/LarekApi';
import {API_URL} from './utils/constants';
import {apiProducts} from './utils/data';
import { Api } from './components/base/Api';

const api = new Api(API_URL);
const eventEmitter = new EventEmitter();
const catalogModel = new CatalogModel(eventEmitter);
const cartModel = new CartModel(eventEmitter);
const orderModel = new OrderModel(eventEmitter);
const larekApi = new LarekApi(api);

//Проверка класса CatalogModel
catalogModel.setProducts(apiProducts.items);
console.log('1. Каталог товаров:', catalogModel.getProducts());

const product = catalogModel.getProductById('412bcf81-7e75-4e70-bdb9-d3c73c9803b7');
console.log('2. Товар по id :', product);

if (product) {
    catalogModel.setSelectedProduct(product);
    console.log('3. Выбранный товар сохранён:', product);
} else {
    console.log('3. Товар не найден');
}

console.log('4. Выбранный товар:', catalogModel.getSelectedProduct());

//Проверка класса CartModel

cartModel.addItem(apiProducts.items[0]);
cartModel.addItem(apiProducts.items[1]);
cartModel.addItem(apiProducts.items[2]);
console.log('1. Товары в корзине после добавления:', cartModel.getItems());

console.log('2. Количество товаров в корзине:', cartModel.getItemCount());

console.log('3. Общая сумма корзины:', cartModel.getTotalPrice());

console.log('4. Товар с существующем id', cartModel.checkItem('854cef69-976d-4c2a-a18c-2aa45046c390'));
console.log('5. Товар с несуществующим id', cartModel.checkItem('fake-id'));

cartModel.deleteItem('854cef69-976d-4c2a-a18c-2aa45046c390');
console.log('6. Корзина после удаления товара:', cartModel.getItems());

cartModel.clearCart();
console.log('7. Корзина после очистки:', cartModel.getItems());

//Проверка класса OrderModel

orderModel.setOrderData({ email: 'test@mail.ru', phone: '+79991234567' });
console.log('1. Данные после сохранения (email, phone):', orderModel.getOrderData());

orderModel.setOrderData({ payment: 'card', address: 'ул. Пушкина, д.1' });
console.log('2. Данные после сохранения всех полей:', orderModel.getOrderData());

console.log('3. Результат валидации (все поля заполнены):', orderModel.validateFields());

//Должен быть true
console.log('4. Заказ валиден?', orderModel.isValid());

orderModel.clear();
console.log('5. Данные после очистки:', orderModel.getOrderData());

//Валидация после очистки (должны быть ошибки)
console.log('6. Результат валидации после очистки:', orderModel.validateFields());

//Должен быть false
console.log('7. Заказ валиден после очистки?', orderModel.isValid());

//Проверка validate с пустыми полями
console.log('8. Ошибки валидации подробно:');
const errors = orderModel.validateFields();
if (errors.payment) console.log('   - payment:', errors.payment);
if (errors.address) console.log('   - address:', errors.address);
if (errors.phone) console.log('   - phone:', errors.phone);
if (errors.email) console.log('   - email:', errors.email);

larekApi.getProducts().then(data => {
  catalogModel.setProducts(data.items);
   console.log(' Товары с сервера:', catalogModel.getProducts());
    })
  .catch(err => {
    console.error("Ошибка при загрузке", err);
  })