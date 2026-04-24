import { CatalogModel } from '../models/CatalogModel';
import { CartModel } from '../models/CartModel';
import { OrderModel } from '../models/OrderModel';
import { LarekApi } from '../communicate/LarekApi';
import { EventEmitter } from '../base/Events';
import { TPayment } from '../../types';
import { ensureElement, cloneTemplate } from '../../utils/utils';

import { Header } from '../views/Header';
import { Gallery } from '../views/Gallery';
import { Modal } from '../views/Modal';
import { CardCatalog } from '../views/CardCatalog';
import { CardPreview } from '../views/CardPreview';
import { CardBasket } from '../views/CardBasket';
import { Basket } from '../views/Basket';
import { OrderForm } from '../views/FormOrder';
import { ContactsForm } from '../views/ContactsForm';
import { SuccessForm } from '../views/SuccessForm';

export class Presenter {
    private header!: Header;
    private gallery!: Gallery;
    private modal!: Modal;
    private basket!: Basket;
    private orderForm!: OrderForm;
    private contactsForm!: ContactsForm;
    private successForm!: SuccessForm;
    private currentProductId: string | null = null;
    private currentProductCard: CardPreview | null = null;

    constructor(
        private catalogModel: CatalogModel,
        private cartModel: CartModel,
        private orderModel: OrderModel,
        private api: LarekApi,
        private events: EventEmitter
    ) {
        this.initViews();
        this.initEvents();
        this.loadProducts();
    }

    private initViews(): void {
        const headerContainer = ensureElement<HTMLElement>('.header');
        const galleryContainer = ensureElement<HTMLElement>('.gallery');
        const modalContainer = ensureElement<HTMLElement>('.modal');

        this.header = new Header(this.events, headerContainer);
        this.gallery = new Gallery(galleryContainer);
        this.modal = new Modal(this.events, modalContainer);

        this.basket = new Basket(this.events);

        const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
        const orderContainer = cloneTemplate(orderTemplate) as HTMLFormElement;
        this.orderForm = new OrderForm(orderContainer, this.events);

        const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
        const contactsContainer = cloneTemplate(contactsTemplate) as HTMLFormElement;
        this.contactsForm = new ContactsForm(contactsContainer, this.events);

        this.successForm = new SuccessForm(this.events);
    }

    private initEvents(): void {
        this.events.on('products:changed', () => {
            this.renderCatalog();
        });

        this.events.on('cart:changed', () => {
            this.updateBasket();
            if (this.currentProductCard) {
                const product = this.catalogModel.getSelectedProduct();
                if (product) {
                    this.currentProductCard.inBasket = this.cartModel.checkItem(product.id);
                }
            }
        });

        this.events.on('card:select', (data: { id: string }) => {
            this.currentProductId = data.id;
            const product = this.catalogModel.getProductById(data.id);
            if (product) {
                this.catalogModel.setSelectedProduct(product);
                this.openProductCard();
            }
        });

        this.events.on('card:action', () => {
            this.handleCardAction();
        });

        this.events.on('basket:remove', (data: { id: string }) => {
            this.cartModel.deleteItem(data.id);
        });

        this.events.on('basket:open', () => {
            this.openBasket();
        });

        this.events.on('order:start', () => {
            this.startOrder();
        });

        this.events.on('order:change', (data: { field: string; value: string }) => {
            if (data.field === 'payment') {
                this.orderModel.setOrderData({ payment: data.value as TPayment });
            } else if (data.field === 'address') {
                this.orderModel.setOrderData({ address: data.value });
            }
        });

        this.events.on('contacts:change', (data: { field: string; value: string }) => {
            if (data.field === 'email') {
                this.orderModel.setOrderData({ email: data.value });
            } else if (data.field === 'phone') {
                this.orderModel.setOrderData({ phone: data.value });
            }
        });

        this.events.on('order:changed', () => {
            const orderData = this.orderModel.getOrderData();
            this.orderForm.payment = orderData.payment;
            this.orderForm.address = orderData.address;
            this.orderForm.valid = this.orderModel.isValidStep1();
            
            const errors = this.orderModel.validateOrderStep1();
            const errorMessages = Object.values(errors).filter(Boolean);
            this.orderForm.errors = errorMessages.join(', ');
            
            this.contactsForm.email = orderData.email;
            this.contactsForm.phone = orderData.phone;
            this.contactsForm.valid = this.orderModel.isValidStep2();
            
            const errors2 = this.orderModel.validateOrderStep2();
            const errorMessages2 = Object.values(errors2).filter(Boolean);
            this.contactsForm.errors = errorMessages2.join(', ');
        });

        this.events.on('order:submit', () => {
            this.openContactsForm();
        });

        this.events.on('contacts:submit', () => {
            this.submitOrder();
        });

        this.events.on('modal:close', () => {
            this.modal.closeModal();
            this.currentProductCard = null;
        });

        this.events.on('success:close', () => {
            this.modal.closeModal();
        });
    }

    private loadProducts(): void {
        this.api.getProducts()
            .then(data => {
                this.catalogModel.setProducts(data.items);
            })
            .catch(err => {
                console.error('Ошибка загрузки товаров:', err);
            });
    }

    private renderCatalog(): void {
        const products = this.catalogModel.getProducts();
        const cards = products.map(product => {
            const card = new CardCatalog(this.events, () => {
                this.events.emit('card:select', { id: product.id });
            });
            card.title = product.title;
            card.price = product.price;
            card.category = product.category;
            card.image = product.image;
            return card.render();
        });
        this.gallery.catalog = cards;
    }

    private updateBasket(): void {
        const items = this.cartModel.getItems();
        const total = this.cartModel.getTotalPrice();
        const count = this.cartModel.getItemCount();

        this.header.counter = count;

        const basketCards = items.map((item, index) => {
            const card = new CardBasket(this.events, () => {
                this.events.emit('basket:remove', { id: item.id });
            });
            card.title = item.title;
            card.price = item.price;
            card.index = index + 1;
            return card.render();
        });
        this.basket.items = basketCards;
        this.basket.total = total;
        this.basket.disabled = items.length === 0;
    }

    private handleCardAction(): void {
        const product = this.catalogModel.getSelectedProduct();
        if (!product) return;

        const inBasket = this.cartModel.checkItem(product.id);
        if (inBasket) {
            this.cartModel.deleteItem(product.id);
        } else {
            if (product.price !== null) {
                this.cartModel.addItem(product);
            }
        }
    }

    private openProductCard(): void {
        const product = this.catalogModel.getSelectedProduct();
        if (!product) return;

        this.currentProductCard = new CardPreview(this.events);
        this.currentProductCard.title = product.title;
        this.currentProductCard.price = product.price;
        this.currentProductCard.category = product.category;
        this.currentProductCard.image = product.image;
        this.currentProductCard.description = product.description;
        this.currentProductCard.buttonDisabled = product.price === null;
        this.currentProductCard.inBasket = this.cartModel.checkItem(product.id);

        this.modal.content = this.currentProductCard.render();
        this.modal.openModal();
    }

    private openBasket(): void {
        this.modal.content = this.basket.render();
        this.modal.openModal();
    }

    private startOrder(): void {
        const orderData = this.orderModel.getOrderData();
        this.orderForm.payment = orderData.payment;
        this.orderForm.address = orderData.address;
        this.orderForm.valid = this.orderModel.isValidStep1();
        
        const errors = this.orderModel.validateOrderStep1();
        const errorMessages = Object.values(errors).filter(Boolean);
        this.orderForm.errors = errorMessages.join(', ');

        this.modal.content = this.orderForm.render();
        this.modal.openModal();
    }

    private openContactsForm(): void {
        const orderData = this.orderModel.getOrderData();
        this.contactsForm.email = orderData.email;
        this.contactsForm.phone = orderData.phone;
        this.contactsForm.valid = this.orderModel.isValidStep2();
        
        const errors = this.orderModel.validateOrderStep2();
        const errorMessages = Object.values(errors).filter(Boolean);
        this.contactsForm.errors = errorMessages.join(', ');

        this.modal.content = this.contactsForm.render();
        this.modal.openModal();
    }

    private submitOrder(): void {
        const orderData = this.orderModel.getOrderData();
        const items = this.cartModel.getItems().map(item => item.id);
        const total = this.cartModel.getTotalPrice();

        const orderRequest = {
            payment: orderData.payment,
            email: orderData.email,
            phone: orderData.phone,
            address: orderData.address,
            total: total,
            items: items
        };

        this.api.postOrder(orderRequest)
            .then(response => {
                this.cartModel.clearCart();
                this.orderModel.clear();
                this.currentProductId = null;
                this.successForm.total = response.total;
                this.modal.content = this.successForm.render();
                this.modal.openModal();
            })
            .catch(err => {
                console.error('Ошибка оформления заказа:', err);
            });
    }
}