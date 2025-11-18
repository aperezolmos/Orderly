package es.ubu.inf.tfg.order.type.barOrder;

import es.ubu.inf.tfg.order.Order;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "bar_orders")
@DiscriminatorValue("BAR")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@SuperBuilder
public class BarOrder extends Order {

    @Builder.Default
    @ToString.Exclude
    private Boolean drinksOnly = false;
}
