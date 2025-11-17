package es.ubu.inf.tfg.order.orderItem;

import java.math.BigDecimal;

import es.ubu.inf.tfg.order.Order;
import es.ubu.inf.tfg.order.orderItem.status.OrderItemStatus;
import es.ubu.inf.tfg.product.Product;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
@Builder
public class OrderItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    @ToString.Include
    private Integer id;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderItemStatus status = OrderItemStatus.PENDING;

    @Builder.Default
    @Column(nullable = false)
    private Integer quantity = 1;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
    

    // --------------------------------------------------------

    @PrePersist
    protected void onCreate() {
        if (totalPrice == null && unitPrice != null) {
            calculateTotalPrice();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        if (totalPrice == null && unitPrice != null) {
            calculateTotalPrice();
        }
    }


    // --------------------------------------------------------

    public void setQuantity(Integer newQuantity) {
        if (newQuantity != null && newQuantity > 0) {
            this.quantity = newQuantity;
            calculateTotalPrice();

            // Notify parent order to recalculate the total amount
            if (order != null) {
                order.calculateTotalAmount();
            }
        }
    }

    public void calculateTotalPrice() {
        if (unitPrice != null && quantity > 0) {
            this.totalPrice = unitPrice.multiply(BigDecimal.valueOf(quantity));
        }
    }
}
