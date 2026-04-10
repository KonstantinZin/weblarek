import { Api } from './Api';
import { IProductsfromApi, IOrderData, IOrderfromApi } from '../../types/index';

export class LarekApi {
  private _api:Api;

  constructor(baseUrl: string) {
    this._api = new Api(baseUrl);
}

 getProducts(): Promise<IProductsfromApi> {
      return this._api.get('/product');
    }

  postOrder(orderData: IOrderData): Promise<IOrderfromApi> {
      return this._api.post('/order', orderData);
    }


}