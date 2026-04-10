import { IApi } from '../../types/index';
import { IProductsfromApi, IOrderData, IOrderfromApi } from '../../types/index';

export class LarekApi {
  private _api:IApi;

  constructor(api: IApi) {
    this._api = api;
}

 getProducts(): Promise<IProductsfromApi> {
      return this._api.get('/product');
    }

  postOrder(orderData: IOrderData): Promise<IOrderfromApi> {
      return this._api.post('/order', orderData);
    }


}