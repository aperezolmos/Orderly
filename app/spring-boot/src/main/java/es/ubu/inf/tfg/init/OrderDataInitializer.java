package es.ubu.inf.tfg.init;

import es.ubu.inf.tfg.order.OrderService;
import es.ubu.inf.tfg.order.type.diningOrder.DiningOrderRepository;
import es.ubu.inf.tfg.order.type.barOrder.BarOrderRepository;
import es.ubu.inf.tfg.order.type.diningOrder.dto.DiningOrderRequestDTO;
import es.ubu.inf.tfg.order.type.barOrder.dto.BarOrderRequestDTO;
import es.ubu.inf.tfg.order.orderItem.dto.OrderItemRequestDTO;
import es.ubu.inf.tfg.order.status.OrderStatus;
import es.ubu.inf.tfg.product.ProductRepository;
import es.ubu.inf.tfg.product.Product;
import es.ubu.inf.tfg.reservation.diningTable.DiningTableService;
import es.ubu.inf.tfg.reservation.diningTable.dto.DiningTableResponseDTO;
import es.ubu.inf.tfg.user.User;
import es.ubu.inf.tfg.user.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

import java.util.List;

@Component
@Order(6)
@RequiredArgsConstructor
@Slf4j
@ConditionalOnProperty(name = "APP_INIT_DEMO_DATA", havingValue = "true")
public class OrderDataInitializer implements CommandLineRunner {

    private final DiningOrderRepository diningOrderRepository;
    private final BarOrderRepository barOrderRepository;
    private final OrderService orderService;
    private final UserRepository userRepository;
    private final DiningTableService diningTableService;
    private final ProductRepository productRepository;

    @Value("${DEFAULT_ADMIN_USERNAME:admin}")
    private String adminUsername;


    @Override
    public void run(String... args) {
        
        if (diningOrderRepository.count() > 0 || barOrderRepository.count() > 0) {
            log.info("Order tables already contain data. Skipping OrderDataInitializer");
            return;
        }

        User admin = userRepository.findByUsername(adminUsername)
            .orElse(null);
        if (admin == null) {
            log.warn("Admin user not found. Skipping OrderDataInitializer");
            return;
        }

        List<DiningTableResponseDTO> tables = diningTableService.findAll();
        if (tables.size() < 4) {
            log.warn("Not enough dining tables found. Skipping OrderDataInitializer");
            return;
        }

        List<Product> products = productRepository.findAll();
        if (products.size() < 10) {
            log.warn("Not enough products found. Skipping OrderDataInitializer");
            return;
        }


        // Items
        OrderItemRequestDTO item1 = OrderItemRequestDTO.builder()
            .productId(products.get(0).getId())
            .quantity(2)
            .build();
        OrderItemRequestDTO item2 = OrderItemRequestDTO.builder()
            .productId(products.get(3).getId())
            .quantity(1)
            .build();
        OrderItemRequestDTO item3 = OrderItemRequestDTO.builder()
            .productId(products.get(10).getId())
            .quantity(3)
            .build();
        OrderItemRequestDTO item4 = OrderItemRequestDTO.builder()
            .productId(products.get(7).getId())
            .quantity(1)
            .build();
        OrderItemRequestDTO item5 = OrderItemRequestDTO.builder()
            .productId(products.get(5).getId())
            .quantity(2)
            .build();
        OrderItemRequestDTO item6 = OrderItemRequestDTO.builder()
            .productId(products.get(6).getId())
            .quantity(4)
            .build();

        Integer orderId;
        

        // BAR ORDERS
        BarOrderRequestDTO barOrder1 = BarOrderRequestDTO.builder()
            .orderType("BAR")
            .customerName("Antonio García")
            .notes("Con hielo")
            .employeeId(admin.getId())
            .drinksOnly(true)
            .items(List.of(item1, item2))
            .build();
        orderId = orderService.create(barOrder1).getId();
        orderService.updateStatus(orderId, OrderStatus.PAID);

        BarOrderRequestDTO barOrder2 = BarOrderRequestDTO.builder()
            .orderType("BAR")
            .customerName("María Rodríguez")
            .employeeId(admin.getId())
            .drinksOnly(false)
            .items(List.of(item2, item3))
            .build();
        orderId = orderService.create(barOrder2).getId();
        orderService.updateStatus(orderId, OrderStatus.IN_PROGRESS);

        BarOrderRequestDTO barOrder3 = BarOrderRequestDTO.builder()
            .orderType("BAR")
            .customerName("José Hernández")
            .employeeId(admin.getId())
            .drinksOnly(false)
            .items(List.of(item3, item4, item5))
            .build();
        orderService.create(barOrder3);

        BarOrderRequestDTO barOrder4 = BarOrderRequestDTO.builder()
            .orderType("BAR")
            .customerName("Manuel López")
            .employeeId(admin.getId())
            .drinksOnly(false)
            .items(List.of(item2, item3, item5, item6))
            .build();
        orderId = orderService.create(barOrder4).getId();
        orderService.updateStatus(orderId, OrderStatus.READY);


        // DINING ORDERS
        DiningOrderRequestDTO diningOrder1 = DiningOrderRequestDTO.builder()
            .orderType("DINING")
            .customerName("Carmen Martínez")
            .notes("Sin gluten")
            .employeeId(admin.getId())
            .tableId(tables.get(3).getId())
            .items(List.of(item1, item6))
            .build();
        orderId = orderService.create(diningOrder1).getId();
        orderService.updateStatus(orderId, OrderStatus.IN_PROGRESS);

        DiningOrderRequestDTO diningOrder2 = DiningOrderRequestDTO.builder()
            .orderType("DINING")
            .customerName("Francisco González")
            .employeeId(admin.getId())
            .tableId(tables.get(1).getId())
            .items(List.of(item2, item5, item3))
            .build();
        orderId = orderService.create(diningOrder2).getId();
        orderService.updateStatus(orderId, OrderStatus.CANCELLED);

        DiningOrderRequestDTO diningOrder3 = DiningOrderRequestDTO.builder()
            .orderType("DINING")
            .customerName("Isabel Sánchez")
            .notes("Con salsas aparte")
            .employeeId(admin.getId())
            .tableId(tables.get(0).getId())
            .items(List.of(item1, item2, item6, item3))
            .build();
        orderId = orderService.create(diningOrder3).getId();
        orderService.updateStatus(orderId, OrderStatus.READY);

        DiningOrderRequestDTO diningOrder4 = DiningOrderRequestDTO.builder()
            .orderType("DINING")
            .customerName("David Pérez")
            .notes("Para compartir entre 2")
            .employeeId(admin.getId())
            .tableId(tables.get(2).getId())
            .items(List.of(item4, item1))
            .build();
        orderId = orderService.create(diningOrder4).getId();
        orderService.updateStatus(orderId, OrderStatus.SERVED);

        log.info("Inserted demo dining and bar orders with items");
    }
}
