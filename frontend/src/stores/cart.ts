import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export interface CartItem {
  productId: string;
  name: string;
  price: number; // in cents
  image: string;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // in cents
  displayPrice: string;
  image: string;
}

export type PaymentMethod = 'qr' | 'ewallet' | 'card';
export type EwalletProvider = 'gopay' | 'ovo' | 'dana' | '';

export const useCartStore = defineStore(
  'cart',
  () => {
    const items = ref<CartItem[]>([]);
    const paymentMethod = ref<PaymentMethod>('qr');
    const ewalletProvider = ref<EwalletProvider>('');

    const itemCount = computed(() =>
      items.value.reduce((sum, item) => sum + item.quantity, 0)
    );

    const totalCents = computed(() =>
      items.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
    );

    const totalDisplay = computed(() =>
      `$${(totalCents.value / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
    );

    function addItem(product: Product) {
      const existing = items.value.find((i) => i.productId === product.id);
      if (existing) {
        existing.quantity++;
      } else {
        items.value.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        });
      }
    }

    function removeItem(productId: string) {
      items.value = items.value.filter((i) => i.productId !== productId);
    }

    function updateQuantity(productId: string, quantity: number) {
      const item = items.value.find((i) => i.productId === productId);
      if (item) {
        if (quantity <= 0) {
          removeItem(productId);
        } else {
          item.quantity = quantity;
        }
      }
    }

    function setPaymentMethod(method: PaymentMethod) {
      paymentMethod.value = method;
      if (method !== 'ewallet') {
        ewalletProvider.value = '';
      }
    }

    function setEwalletProvider(provider: EwalletProvider) {
      ewalletProvider.value = provider;
    }

    function clearCart() {
      items.value = [];
      paymentMethod.value = 'qr';
      ewalletProvider.value = '';
    }

    // Build the payload for the order API
    function orderPayload() {
      return items.value.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));
    }

    return {
      items,
      itemCount,
      totalCents,
      totalDisplay,
      paymentMethod,
      ewalletProvider,
      addItem,
      removeItem,
      updateQuantity,
      setPaymentMethod,
      setEwalletProvider,
      clearCart,
      orderPayload,
    };
  },
  {
    persist: true, // uses localStorage via pinia-plugin-persistedstate
  }
);
