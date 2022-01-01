import { OrderStatus } from '@the-crew/common/enums';

import type { Cart, Order, SubOrder } from '@the-crew/common';

export function generateSubOrdersToBeSaved(_cartItems: Cart[], order: Order) {
  const _subOrders: Partial<SubOrder>[] = [];
  _cartItems.forEach(cart => {
    _subOrders.push({
      serviceId: cart.id,
      orderId: order?.id,
      status: OrderStatus.SCHEDULED,
      quantity: cart.quantity,
      price: cart.price,
    });
  });
  return { bulk: _subOrders };
}
