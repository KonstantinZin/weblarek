export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = 'card' | 'cash' | '';

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

//ответ сервера при получении товаров
export interface IProductsfromApi {
    total:number;
    items: IProduct[];
}

export interface IOrderData {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
    total:number;
    items:string[];
}

// Ответ сервера после оформления заказа
export interface IOrderfromApi {
    id: string;
    total:number;
}