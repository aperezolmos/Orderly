package es.ubu.inf.tfg.order.type.diningOrder;

import es.ubu.inf.tfg.order.Order;
import es.ubu.inf.tfg.reservation.diningTable.DiningTable;

import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "dining_orders")
@DiscriminatorValue("DINING")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@SuperBuilder
public class DiningOrder extends Order {
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "table_id", nullable = false)
    @ToString.Exclude
    private DiningTable table;
}
