package es.ubu.inf.tfg.order.type.barOrder;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import es.ubu.inf.tfg.order.status.OrderStatus;

@Repository
public interface BarOrderRepository extends JpaRepository<BarOrder, Integer> {
    List<BarOrder> findByDrinksOnly(Boolean drinksOnly);
    List<BarOrder> findByStatus(OrderStatus status);
    List<BarOrder> findByDrinksOnlyAndStatus(Boolean drinksOnly, OrderStatus status);
    List<BarOrder> findByEmployeeId(Integer employeeId);
    List<BarOrder> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT b FROM BarOrder b WHERE b.status IN :statuses ORDER BY b.createdAt ASC")
    List<BarOrder> findPendingBarOrders(@Param("statuses") List<OrderStatus> statuses);
    
    @Query("SELECT b FROM BarOrder b WHERE b.createdAt >= :startOfDay ORDER BY b.createdAt DESC")
    List<BarOrder> findTodayBarOrders(@Param("startOfDay") LocalDateTime startOfDay);
}
