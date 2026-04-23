import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { CatalogModel } from './components/models/CatalogModel';
import { CartModel } from './components/models/CartModel';
import { OrderModel } from './components/models/OrderModel';
import { LarekApi } from './components/communicate/LarekApi';
import { API_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { Presenter } from './components/presenter/Presenter';

const api = new Api(API_URL);
const events = new EventEmitter();

const catalogModel = new CatalogModel(events);
const cartModel = new CartModel(events);
const orderModel = new OrderModel(events);
const larekApi = new LarekApi(api);

const presenter = new Presenter(
    catalogModel,
    cartModel,
    orderModel,
    larekApi,
    events
);