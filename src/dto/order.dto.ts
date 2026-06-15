// DTOs de pedido usados na API.
export interface CreateOrderItemDto {
  productId: string;
  quantity: number;
}

export interface CreateOrderDto {
  clientId: string;
  addressId: string;
  items: CreateOrderItemDto[];
  status?: string | undefined;
}

export interface UpdateOrderDto {
  status: string;
}

export interface OrderItemResponseDto {
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderResponseDto {
  id: string;
  clientId: string;
  addressId: string;
  status: string;
  total: number;
  createdAt: string;
  items: OrderItemResponseDto[];
}

export interface OrderListDTO {
  content: OrderResponseDto[];
  page: number;
  size: number;
}
