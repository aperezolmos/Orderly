package es.ubu.inf.tfg.order.type.barOrder.dto.mapper;

import es.ubu.inf.tfg.order.orderItem.dto.mapper.OrderItemMapper;
import es.ubu.inf.tfg.order.type.barOrder.BarOrder;
import es.ubu.inf.tfg.order.type.barOrder.dto.BarOrderRequestDTO;
import es.ubu.inf.tfg.order.type.barOrder.dto.BarOrderResponseDTO;

import es.ubu.inf.tfg.user.User;
import es.ubu.inf.tfg.user.UserService;

import jakarta.persistence.DiscriminatorValue;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring", uses = {OrderItemMapper.class})
public abstract class BarOrderMapper {
    
    @Autowired
    protected UserService userService;


    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "status", ignore = true) 
    @Mapping(target = "totalAmount", ignore = true)
    @Mapping(target = "employee", source = "dto.employeeId")
    @Mapping(target = "items", source = "dto.items")
    public abstract BarOrder toEntity(BarOrderRequestDTO dto);


    @Mapping(target = "orderType", source = ".", qualifiedByName = "mapEntityToOrderType")
    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(target = "employeeName", source = "employee.username")
    @Mapping(target = "itemCount", expression = "java(entity.getItems() != null ? entity.getItems().size() : 0)")
    @Mapping(target = "items", ignore = true)
    public abstract BarOrderResponseDTO toResponseDTO(BarOrder entity);


    @Mapping(target = "orderType", source = ".", qualifiedByName = "mapEntityToOrderType")
    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(target = "employeeName", source = "employee.username")
    @Mapping(target = "itemCount", expression = "java(entity.getItems() != null ? entity.getItems().size() : 0)")
    public abstract BarOrderResponseDTO toDetailedResponseDTO(BarOrder entity);

    
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "status", ignore = true) 
    @Mapping(target = "totalAmount", ignore = true)
    @Mapping(target = "employee", source = "dto.employeeId")
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "customerName", source = "dto.customerName",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.SET_TO_NULL)
    @Mapping(target = "notes", source = "dto.notes",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.SET_TO_NULL)
    public abstract void updateEntityFromDTO(BarOrderRequestDTO dto, @MappingTarget BarOrder entity);


    // --------------------------------------------------------

    protected User mapEmployeeIdToUser(Integer employeeId) {
        if (employeeId == null) return null;
        return userService.findEntityById(employeeId); 
    }

    @Named("mapEntityToOrderType")
    protected String mapOrderType(BarOrder entity) {
        return BarOrder.class.getAnnotation(DiscriminatorValue.class).value(); 
    }
}
