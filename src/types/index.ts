export type PaymentMethod = 'card' | 'cash';
export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiMethod): Promise<T>;
}

export interface IProduct {
    id: string;
    title: string;
    image: string;
    category: string;
    price: number | null;
    description: string;
}

export interface IBuyer {
    payment: PaymentMethod | '';
    address: string;
    email: string;
    phone: string;
}

export interface IOrderData {
    payment: PaymentMethod;
    email: string;
    phone: string;
    address: string;
    total: number;
    items: string[];
}

export interface IOrderResult {
    id: string;
    total: number;
}

export interface IApiResponse<T> {
    total: number;
    items: T[];
}

export interface ICartChangedEvent {
    items: IProduct[];
    total: number;
    count: number;
}

export interface ICatalogChangedEvent {
    items: IProduct[];
}

export interface IItemSelectedEvent {
    item: IProduct;
}

export interface IPaymentChangeEvent {
    payment: string;
}

export interface IAddressChangeEvent {
    address: string;
}

export interface IEmailChangeEvent {
    email: string;
}

export interface IPhoneChangeEvent {
    phone: string;
}