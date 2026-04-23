import { CatalogModel } from '../models/CatalogModel';
import { CartModel } from '../models/CartModel';
import { OrderModel } from '../models/OrderModel';
import { LarekApi } from '../communicate/LarekApi';
import { EventEmitter } from '../base/Events';
import { TPayment  } from '../../types';
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
    private currentProductId: string | null = null;  // Добавлено

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

    private initViews() {
    const headerContainer = ensureElement<HTMLElement>('.header');
    const galleryContainer = ensureElement<HTMLElement>('.gallery');
    const modalContainer = ensureElement<HTMLElement>('.modal');

    this.header = new Header(this.events, headerContainer);
    this.gallery = new Gallery(galleryContainer);
    this.modal = new Modal(this.events, modalContainer);

    this.basket = new Basket( this.events);

    const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
    const orderContainer = cloneTemplate(orderTemplate) as HTMLFormElement;
    this.orderForm = new OrderForm(orderContainer, this.events);

    const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
    const contactsContainer = cloneTemplate(contactsTemplate) as HTMLFormElement;
    this.contactsForm = new ContactsForm(contactsContainer, this.events);
    this.successForm = new SuccessForm(this.events);
}
    

    private initEvents():void {
        this.events.on('products:changed', () => {
            this.renderCatalog();
        });

        this.events.on('cart:changed', () => {
            this.updateBasket();
            if (this.currentProductId) {
                this.openProductCard(this.currentProductId);
            }
        });

        this.events.on('card:select', (data: { id: string }) => {
            this.openProductCard(data.id);
        });

        this.events.on('card:add', (data: { id: string }) => {
            this.addToBasket(data.id);
        });

        this.events.on('card:remove', (data: { id: string }) => {
            this.removeFromBasket(data.id);
        });

        this.events.on('basket:remove', (data: { id: string }) => {
            this.removeFromBasket(data.id);
        });

        this.events.on('basket:open', () => {
            this.openBasket();
        });

        this.events.on('order:start', () => {
            this.startOrder();
        });

       this.events.on('order:submit', (data: { payment: string; address: string }) => {
      this.orderModel.setOrderData({
        payment: data.payment as TPayment,
        address: data.address
    });
    this.openContactsForm();
});

        this.events.on('contacts:submit', (data: { email: string; phone: string }) => {
            this.orderModel.setOrderData(data);
            this.submitOrder();
        });

        this.events.on('modal:close', () => {
            this.modal.closeModal();
            this.currentProductId = null;  
        });

        this.events.on('success:close', () => {
            this.modal.closeModal();
            this.cartModel.clearCart();
            this.orderModel.clear();
            this.currentProductId = null;  
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
            const card = new CardCatalog(this.events);
            card.id = product.id;
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
            const card = new CardBasket(this.events);
            card.id = item.id;
            card.title = item.title;
            card.price = item.price;
            card.index = index + 1;
            return card.render();
        });
        this.basket.items = basketCards;
        this.basket.total = total;
        this.basket.disabled = items.length === 0;
    }

    private openProductCard(id: string): void {
        this.currentProductId = id;  
        const product = this.catalogModel.getProductById(id);
        if (!product) return;

        const card = new CardPreview(this.events);
        card.id = product.id;
        card.title = product.title;
        card.price = product.price;
        card.category = product.category;
        card.image = product.image;
        card.description = product.description;

        const inBasket = this.cartModel.checkItem(product.id);
        card.buttonText = inBasket ? 'Удалить из корзины' : 'Купить';
        card.buttonDisabled = product.price === null;

        this.modal.content = card.render();
        this.modal.openModal();
    }

    private addToBasket(id: string): void {
        const product = this.catalogModel.getProductById(id);
        if (product && product.price !== null) {
            this.cartModel.addItem(product);
        }
    }

    private removeFromBasket(id: string): void {
        this.cartModel.deleteItem(id);
        this.updateBasket();
    }

    private openBasket(): void {
        this.currentProductId = null;  
        this.basket.render();
        this.modal.content = this.basket.render();
        this.modal.openModal();
    }

    private startOrder(): void {
        this.currentProductId = null;  
        this.orderForm.render();
        this.modal.content = this.orderForm.render();
        this.modal.openModal();
    }

    private openContactsForm(): void {
        this.contactsForm.render();
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
                this.successForm.total = response.total;
                this.modal.content = this.successForm.render();
                this.modal.openModal();
            })
            .catch(err => {
                console.error('Ошибка оформления заказа:', err);
            });
    }
}