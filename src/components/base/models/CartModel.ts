import { IProduct } from '../../../types/index';
import {EventEmitter} from '../Events';

export class CartModel {
  private _items:IProduct[] = [];
  protected events: EventEmitter;

   constructor(events:EventEmitter) {
    this.events = events;
  }

  public getItems():IProduct[] {
    return this._items;
  }

  public checkItem(id:string): boolean {
    if(this._items.some(item => item.id === id)) {
      return true;
    }
    return false;
  }

  public addItem(product:IProduct):void {
    if(!this.checkItem(product.id)) {
      this._items.push(product);
      this.events.emit('cart:changed', this._items)
    }
  }

  public deleteItem(id:string):void {
    this._items = this._items.filter(item => item.id !== id);
     this.events.emit('cart:changed', this._items)
  }

  public clearCart():void {
    this._items = [];
    this.events.emit('cart:changed', this._items)
  }

  public getTotalPrice():number {
    return this._items.reduce((acc, item) => acc + (item.price ?? 0), 0);
  }

  public getItemCount():number {
    return this._items.length;
  }
}