package es.ubu.inf.tfg.order.orderItem;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import es.ubu.inf.tfg.order.orderItem.status.OrderItemStatus;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
    List<OrderItem> findByOrderId(Integer orderId);
    List<OrderItem> findByStatus(OrderItemStatus status);
}
