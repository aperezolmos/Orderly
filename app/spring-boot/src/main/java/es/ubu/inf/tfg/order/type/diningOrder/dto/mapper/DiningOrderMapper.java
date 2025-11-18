package es.ubu.inf.tfg.order.type.diningOrder.dto.mapper;

import es.ubu.inf.tfg.order.orderItem.dto.mapper.OrderItemMapper;
import es.ubu.inf.tfg.order.type.diningOrder.DiningOrder;
import es.ubu.inf.tfg.order.type.diningOrder.dto.DiningOrderRequestDTO;
import es.ubu.inf.tfg.order.type.diningOrder.dto.DiningOrderResponseDTO;

import es.ubu.inf.tfg.reservation.diningTable.DiningTable;
import es.ubu.inf.tfg.reservation.diningTable.DiningTableService;
import es.ubu.inf.tfg.user.User;
import es.ubu.inf.tfg.user.UserService;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring", uses = {OrderItemMapper.class})
public abstract class DiningOrderMapper {
    
    @Autowired
    protected UserService userService;
    
    @Autowired
    protected DiningTableService diningTableService;


    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "status", ignore = true) 
    @Mapping(target = "totalAmount", ignore = true)
    @Mapping(target = "employee", source = "dto.employeeId")
    @Mapping(target = "table", source = "dto.tableId")
    @Mapping(target = "items", source = "dto.items")
    public abstract DiningOrder toEntity(DiningOrderRequestDTO dto);


    @Mapping(target = "orderType", ignore = true, qualifiedByName = "mapEntityToOrderType")
    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(target = "employeeName", source = "employee.firstName")
    @Mapping(target = "tableId", source = "table.id")
    @Mapping(target = "tableName", source = "table.name")
    @Mapping(target = "items", ignore = true)
    public abstract DiningOrderResponseDTO toResponseDTO(DiningOrder entity);


    @Mapping(target = "orderType", ignore = true, qualifiedByName = "mapEntityToOrderType")
    @Mapping(target = "employeeId", source = "employee.id")
    @Mapping(target = "employeeName", source = "employee.firstName")
    @Mapping(target = "tableId", source = "table.id")
    @Mapping(target = "tableName", source = "table.name")
    public abstract DiningOrderResponseDTO toDetailedResponseDTO(DiningOrder entity);


    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "status", ignore = true) 
    @Mapping(target = "totalAmount", ignore = true)
    @Mapping(target = "employee", source = "dto.employeeId")
    @Mapping(target = "table", source = "dto.tableId")
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "customerName", source = "dto.customerName",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.SET_TO_NULL)
    @Mapping(target = "notes", source = "dto.notes",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.SET_TO_NULL)
    public abstract void updateEntityFromDTO(DiningOrderRequestDTO dto, @MappingTarget DiningOrder entity);


    // --------------------------------------------------------

    @Named("mapEntityToOrderType")
    protected String mapOrderType(DiningOrder entity) {
        return "DINING";
    }

    protected User mapEmployeeIdToUser(Integer employeeId) {
        if (employeeId == null) return null;
        return userService.findEntityById(employeeId); 
    }

    protected DiningTable mapTableIdToDiningTable(Integer tableId) {
        if (tableId == null) return null;
        return diningTableService.findEntityById(tableId);
    }
}
