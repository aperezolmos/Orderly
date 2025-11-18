package es.ubu.inf.tfg.order.type.diningOrder;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import es.ubu.inf.tfg.order.status.OrderStatus;

@Repository
public interface DiningOrderRepository extends JpaRepository<DiningOrder, Integer> {
    List<DiningOrder> findByTableId(Integer tableId);
    List<DiningOrder> findByStatus(OrderStatus status);
    List<DiningOrder> findByTableIdAndStatus(Integer tableId, OrderStatus status);
    List<DiningOrder> findByEmployeeId(Integer employeeId);
    List<DiningOrder> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT DISTINCT d.table.id FROM DiningOrder d WHERE d.status IN :activeStatuses")
    List<Integer> findTablesWithActiveOrders(@Param("activeStatuses") List<OrderStatus> activeStatuses);
    
    @Query("SELECT d FROM DiningOrder d WHERE d.status IN :statuses ORDER BY d.createdAt ASC")
    List<DiningOrder> findPendingDiningOrders(@Param("statuses") List<OrderStatus> statuses);
    
    @Query("SELECT d FROM DiningOrder d WHERE d.createdAt >= :startOfDay ORDER BY d.createdAt DESC")
    List<DiningOrder> findTodayDiningOrders(@Param("startOfDay") LocalDateTime startOfDay);
}
