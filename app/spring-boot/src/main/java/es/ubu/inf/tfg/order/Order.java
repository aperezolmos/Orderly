package es.ubu.inf.tfg.order;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import es.ubu.inf.tfg.order.details.OrderStatus;
import es.ubu.inf.tfg.order.details.OrderType;
import es.ubu.inf.tfg.order.orderItem.OrderItem;
import es.ubu.inf.tfg.user.User;

import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "orders")
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "order_type", discriminatorType = DiscriminatorType.STRING)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
@SuperBuilder
public abstract class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    @ToString.Include
    private Integer id;

    @Column(name = "order_number", unique = true, length = 20)
    @ToString.Include
    private String orderNumber;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "order_type", insertable = false, updatable = false)
    @ToString.Include
    private OrderType orderType;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PENDING;

    @Builder.Default
    @Column(precision = 10, scale = 2)
    private BigDecimal totalAmount = BigDecimal.ZERO;
    
    @Column(length = 100)
    private String customerName;
    
    private String notes;


    @Builder.Default
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private User employee;


    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;


    // --------------------------------------------------------

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now().plusHours(2);
        this.updatedAt = this.createdAt;
        
        if (orderNumber == null) {
            this.orderNumber = generateOrderNumber(createdAt);
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now().plusHours(2);
    }


    // --------------------------------------------------------

    public void addItem(OrderItem item) {
        if (item != null && !items.contains(item)) {
            items.add(item);
            item.setOrder(this);
            calculateTotalAmount();
        }
    }
    
    public void removeItem(OrderItem item) {
        if (item != null && items.remove(item)) {
            item.setOrder(null);
            calculateTotalAmount();
        }
    }

    public void clearItems() {
        List<OrderItem> itemsToRemove = new ArrayList<>(items);
        for (OrderItem item : itemsToRemove) {
            removeItem(item);
        }
    }

    public void calculateTotalAmount() {
        this.totalAmount = items.stream()
                .map(OrderItem::getTotalPrice)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }


    // --------------------------------------------------------

    private String generateOrderNumber(LocalDateTime time) { //TODO: usar este formato o un num simple¿?
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS");
        String timestampPart = time.format(formatter);
        return "ORD-" + timestampPart;
    }
}
