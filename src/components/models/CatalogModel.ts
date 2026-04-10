import { IProduct } from '../../types/index';
import {EventEmitter} from '../base/Events';

export class CatalogModel {
  private _products: IProduct[] = [];
  private _selectedProduct: IProduct | null = null;
  protected events: EventEmitter;

  constructor(events:EventEmitter) {
    this.events = events;
  }


 public setProducts(products: IProduct[]): void {
    this._products = products;
    this.events.emit('products:changed', this._products);
  }

  public getProducts():IProduct[]{
    return this._products;
  }

  public getProductById(id:string):IProduct | undefined {
    return this._products.find(product => product.id === id);
  }

  public setSelectedProduct(product:IProduct):void {
    this._selectedProduct = product;
    this.events.emit('product:selected', this._selectedProduct);
  }

  public getSelectedProduct():IProduct | null {
    return this._selectedProduct;
  }
}