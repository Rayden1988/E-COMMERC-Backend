export interface CreateOrderItemInput {
  productId: string;
  quantity: number;
}

export interface CreateOrderInput {
  clientId: string;
  addressId: string;
  items: CreateOrderItemInput[];
  status?: string | undefined;
}

export interface OrderItemRecord {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderRecord {
  id: string;
  clientId: string;
  addressId: string;
  status: string;
  total: number;
  createdAt: string;
  items: OrderItemRecord[];
}

export interface OrderRepository {
  createOrder(input: CreateOrderInput): Promise<OrderRecord>;
  getAllOrders({
    page,
    size,
  }: {
    page: number;
    size: number;
  }): Promise<OrderRecord[]>;
  getOrderById(id: string): Promise<OrderRecord | null>;
  updateOrderStatus(id: string, status: string): Promise<OrderRecord | null>;
  deleteOrder(id: string): Promise<boolean>;
}
