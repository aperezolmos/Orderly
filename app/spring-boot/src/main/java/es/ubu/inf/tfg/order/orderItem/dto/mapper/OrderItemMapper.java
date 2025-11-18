package es.ubu.inf.tfg.order.orderItem.dto.mapper;

import es.ubu.inf.tfg.order.orderItem.OrderItem;
import es.ubu.inf.tfg.order.orderItem.dto.OrderItemRequestDTO;
import es.ubu.inf.tfg.order.orderItem.dto.OrderItemResponseDTO;
import es.ubu.inf.tfg.product.Product;
import es.ubu.inf.tfg.product.ProductService;

import java.math.BigDecimal;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class OrderItemMapper {

    @Autowired
    protected ProductService productService;

    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "unitPrice", ignore = true)
    @Mapping(target = "totalPrice", ignore = true)
    @Mapping(target = "product", source = "productId")
    @Mapping(target = "order", ignore = true)
    public abstract OrderItem toEntity(OrderItemRequestDTO requestDTO);


    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "productName", source = "product.name")
    public abstract OrderItemResponseDTO toResponseDTO(OrderItem item);


    // --------------------------------------------------------

    protected Product mapProductIdToProduct(Integer productId) {
        if (productId == null) return null;
        return productService.findEntityById(productId);
    }

    @AfterMapping
    protected void setOrderItemUnitPrice(@MappingTarget OrderItem orderItem) {
        if (orderItem != null) {
            if (orderItem.getProduct() != null && orderItem.getUnitPrice() == null) {
                orderItem.setUnitPrice(new BigDecimal(orderItem.getProduct()
                    .getPrice().toString()));
            }
        }
    }
}
