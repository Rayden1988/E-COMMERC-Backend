// Regra de negocio para pedidos.
import { AppError } from "../errors/app-error.js";
import type {
  CreateOrderDto,
  OrderListDTO,
  OrderResponseDto,
  UpdateOrderDto,
} from "../dto/order.dto.js";
import type { OrderRepository } from "../repository/interfaces/order.repository.js";

export class OrderService {
  constructor(private orderRepository: OrderRepository) {}

  // Converte o retorno do repositório para o formato da API
  private toResponse(order: {
    id: string;
    clientId: string;
    addressId: string;
    status: string;
    total: number;
    createdAt: string;
    items: Array<{ productId: string; quantity: number; unitPrice: number }>;
  }): OrderResponseDto {
    return {
      id: order.id,
      clientId: order.clientId,
      addressId: order.addressId,
      status: order.status,
      total: order.total,
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.quantity * item.unitPrice,
      })),
    };
  }

  // Cria um pedido novo
  async create(dto: CreateOrderDto): Promise<OrderResponseDto> {
    // Um pedido precisa ter ao menos um item
    if (!dto.items.length) {
      throw new AppError("At least one order item is required", 400);
    }

    // Salva o pedido no repositório
    const order = await this.orderRepository.createOrder(dto);

    return this.toResponse(order);
  }

  // Lista pedidos com paginação
  async getAll({
    page,
    size,
  }: {
    page: number;
    size: number;
  }): Promise<OrderListDTO> {
    // Busca os pedidos e formata para resposta
    const orders = await this.orderRepository.getAllOrders({ page, size });
    return {
      content: orders.map((order) => this.toResponse(order)),
      page,
      size,
    };
  }

  // Busca um pedido pelo id
  async getById(id: string): Promise<OrderResponseDto> {
    // Procura o pedido no banco
    const order = await this.orderRepository.getOrderById(id);

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    return this.toResponse(order);
  }

  // Atualiza o status do pedido
  async update(
    id: string,
    dto: UpdateOrderDto,
  ): Promise<OrderResponseDto> {
    // Verifica se o pedido existe
    const order = await this.orderRepository.getOrderById(id);

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    // Atualiza apenas o status
    const updated = await this.orderRepository.updateOrderStatus(id, dto.status);

    if (!updated) {
      throw new AppError("Order not updated", 400);
    }

    return this.toResponse(updated);
  }

  // Remove o pedido e devolve o estoque
  async delete(id: string): Promise<void> {
    // Tenta apagar o pedido
    const deleted = await this.orderRepository.deleteOrder(id);

    if (!deleted) {
      throw new AppError("Order not found", 404);
    }
  }
}
