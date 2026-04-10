import { IBuyer } from '../../types/index';
import { TPayment} from '../../types/index';
import {EventEmitter} from '../base/Events';
import {TErrorsBuyer} from '../../types/index'

export class OrderModel {
  private _payment:TPayment = '';
  private _address:string = '';
  private _phone:string = '';
  private _email:string = '';
  protected events: EventEmitter;

  constructor(events:EventEmitter) {
    this.events = events;
  }


  public getOrderData():IBuyer {
    return {
    payment: this._payment, 
    address: this._address, 
    phone: this._phone, 
    email: this._email
    };
  }

  public setOrderData(data: Partial<IBuyer>):void {
    if(data.payment !== undefined) {
      this._payment = data.payment;
    }

    if(data.address !== undefined) {
      this._address = data.address;
    }

    if(data.phone !== undefined) {
      this._phone = data.phone;
    }

    if(data.email !== undefined) {
      this._email = data.email;
    }

    this.events.emit('order:changed', this.getOrderData())
  }

  public clear(): void {
    this._payment = '';
    this._address = '';
    this._phone = '';
    this._email = '';
    this.events.emit('order:changed', this.getOrderData());
  }

  public validateFields(): TErrorsBuyer {
    const errors: TErrorsBuyer = {};

    if (this._payment === '') {
        errors.payment = 'Выберите способ оплаты';
    }

    if (this._address === '') {
        errors.address = 'Укажите адрес доставки';
    }

    if (this._phone === '') {
        errors.phone = 'Укажите номер телефона';
    }

    if (this._email === '') {
        errors.email = 'Укажите email';
    }

    return errors;
}

    public isValid(): boolean {
    return Object.keys(this.validateFields()).length === 0;
}
  
}