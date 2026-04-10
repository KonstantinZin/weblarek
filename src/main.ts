import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { CatalogModel } from './components/base/models/CatalogModel';
import { CartModel } from './components/base/models/CartModel';
import { OrderModel } from './components/base/models/OrderModel';
import { LarekApi } from './components/base/LarekApi';
import {API_URL} from './utils/constants';

const eventEmitter = new EventEmitter();
const catalogModel = new CatalogModel(eventEmitter);
const cartModel = new CartModel(eventEmitter);
const orderModel = new OrderModel(eventEmitter);
const larekApi = new LarekApi(API_URL);

larekApi.getProducts().then(data => {
  catalogModel.setProducts(data.items);
   console.log(' Товары с сервера:', catalogModel.getProducts());
    })
  .catch(err => {
    console.error("Ошибка при загрузке", err);
  })