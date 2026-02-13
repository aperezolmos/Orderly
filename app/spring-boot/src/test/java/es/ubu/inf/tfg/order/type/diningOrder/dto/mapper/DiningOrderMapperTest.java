package es.ubu.inf.tfg.order.type.diningOrder.dto.mapper;

import es.ubu.inf.tfg.order.orderItem.OrderItem;
import es.ubu.inf.tfg.order.orderItem.dto.mapper.OrderItemMapper;
import es.ubu.inf.tfg.order.type.diningOrder.DiningOrder;
import es.ubu.inf.tfg.order.type.diningOrder.dto.DiningOrderRequestDTO;
import es.ubu.inf.tfg.order.type.diningOrder.dto.DiningOrderResponseDTO;
import es.ubu.inf.tfg.reservation.diningTable.DiningTable;
import es.ubu.inf.tfg.reservation.diningTable.DiningTableService;
import es.ubu.inf.tfg.user.User;
import es.ubu.inf.tfg.user.UserService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DiningOrderMapperTest {

    @InjectMocks
    private DiningOrderMapperImpl diningOrderMapper;

    @Mock
    private UserService userService;
    @Mock
    private DiningTableService diningTableService;
    @Mock
    private OrderItemMapper orderItemMapper;
    

    private static final Integer EMPLOYEE_ID = 1;
    private static final String EMPLOYEE_USERNAME = "amanda";
    private static final Integer TABLE_ID = 5;
    private static final String TABLE_NAME = "TABLE-5";
    private static final String ORDER_NUMBER = "DINING-001";
    private static final String ORDER_TYPE_DINING = "DINING";
    private static final String CUSTOMER_NAME = "Dining Customer";
    private static final String NOTES = "Gluten allergies";

    private User employee;
    private DiningTable diningTable;
    private DiningOrderRequestDTO diningOrderRequestDTO;
    private DiningOrder diningOrder;
    private OrderItem orderItem;


    @BeforeEach
    void setUp() {
        
        employee = User.builder()
                .id(EMPLOYEE_ID)
                .username(EMPLOYEE_USERNAME)
                .build();

        diningTable = DiningTable.builder()
                .id(TABLE_ID)
                .name(TABLE_NAME)
                .capacity(4)
                .isActive(true)
                .build();

        orderItem = OrderItem.builder()
                .id(1)
                .quantity(2)
                .unitPrice(new BigDecimal("8.50"))
                .totalPrice(new BigDecimal("17.00"))
                .build();

        diningOrderRequestDTO = DiningOrderRequestDTO.builder()
                .orderNumber(ORDER_NUMBER)
                .orderType(ORDER_TYPE_DINING)
                .customerName(CUSTOMER_NAME)
                .notes(NOTES)
                .employeeId(EMPLOYEE_ID)
                .tableId(TABLE_ID)
                .build();

        diningOrder = DiningOrder.builder()
                .id(1)
                .orderNumber(ORDER_NUMBER)
                .customerName(CUSTOMER_NAME)
                .notes(NOTES)
                .employee(employee)
                .table(diningTable)
                .build();
    }


    // --------------------------------------------------------

    @Test
    void toEntity_ValidDiningOrderRequestDTO_ShouldMapCorrectly() {
        
        when(userService.findEntityById(EMPLOYEE_ID)).thenReturn(employee);
        when(diningTableService.findEntityById(TABLE_ID)).thenReturn(diningTable);

        DiningOrder result = diningOrderMapper.toEntity(diningOrderRequestDTO);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isNull();
        assertThat(result.getOrderNumber()).isEqualTo(ORDER_NUMBER);
        assertThat(result.getCustomerName()).isEqualTo(CUSTOMER_NAME);
        assertThat(result.getNotes()).isEqualTo(NOTES);
        assertThat(result.getEmployee()).isEqualTo(employee);
        assertThat(result.getTable()).isEqualTo(diningTable);

        verify(userService).findEntityById(EMPLOYEE_ID);
        verify(diningTableService).findEntityById(TABLE_ID);
    }

    @Test
    void toResponseDTO_ValidDiningOrder_ShouldMapCorrectly() {
        
        DiningOrderResponseDTO result = diningOrderMapper.toResponseDTO(diningOrder);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(diningOrder.getId());
        assertThat(result.getOrderNumber()).isEqualTo(ORDER_NUMBER);
        assertThat(result.getCustomerName()).isEqualTo(CUSTOMER_NAME);
        assertThat(result.getNotes()).isEqualTo(NOTES);
        assertThat(result.getOrderType()).isEqualTo(ORDER_TYPE_DINING);
        assertThat(result.getEmployeeId()).isEqualTo(EMPLOYEE_ID);
        assertThat(result.getEmployeeName()).isEqualTo(EMPLOYEE_USERNAME);
        assertThat(result.getTableId()).isEqualTo(TABLE_ID);
        assertThat(result.getTableName()).isEqualTo(TABLE_NAME);
        assertThat(result.getItems()).isNull();
    }

    @Test
    void toDetailedResponseDTO_ValidDiningOrder_ShouldMapWithItems() {
        
        diningOrder.setItems(List.of(orderItem));

        DiningOrderResponseDTO result = diningOrderMapper.toDetailedResponseDTO(diningOrder);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(diningOrder.getId());
        assertThat(result.getOrderNumber()).isEqualTo(ORDER_NUMBER);
        assertThat(result.getOrderType()).isEqualTo(ORDER_TYPE_DINING);
        assertThat(result.getEmployeeId()).isEqualTo(EMPLOYEE_ID);
        assertThat(result.getEmployeeName()).isEqualTo(EMPLOYEE_USERNAME);
        assertThat(result.getTableId()).isEqualTo(TABLE_ID);
        assertThat(result.getTableName()).isEqualTo(TABLE_NAME);
        assertThat(result.getItems()).isNotNull();
        assertThat(result.getItems()).hasSize(1);
    }

    @Test
    void updateEntityFromDTO_ValidDiningOrderRequestDTO_ShouldUpdateFields() {
        
        String ORDER_NUMBER_UPDATED = "DINING-UPDATED";
        String CUSTOMER_NAME_UPDATED = "Updated Customer";
        String NOTES_UPDATED = "Updated notes";
        Integer NEW_EMPLOYEE_ID = 2;
        Integer NEW_TABLE_ID = 6;

        DiningOrderRequestDTO updateDTO = DiningOrderRequestDTO.builder()
                .orderNumber(ORDER_NUMBER_UPDATED)
                .customerName(CUSTOMER_NAME_UPDATED)
                .notes(NOTES_UPDATED)
                .employeeId(NEW_EMPLOYEE_ID)
                .tableId(NEW_TABLE_ID)
                .build();

        User newEmployee = User.builder()
                .id(NEW_EMPLOYEE_ID)
                .username("ana")
                .build();

        DiningTable newTable = DiningTable.builder()
                .id(NEW_TABLE_ID)
                .name("NewTable")
                .build();

        when(userService.findEntityById(NEW_EMPLOYEE_ID)).thenReturn(newEmployee);
        when(diningTableService.findEntityById(NEW_TABLE_ID)).thenReturn(newTable);

        diningOrderMapper.updateEntityFromDTO(updateDTO, diningOrder);

        assertThat(diningOrder.getOrderNumber()).isEqualTo(ORDER_NUMBER_UPDATED);
        assertThat(diningOrder.getCustomerName()).isEqualTo(CUSTOMER_NAME_UPDATED);
        assertThat(diningOrder.getNotes()).isEqualTo(NOTES_UPDATED);
        assertThat(diningOrder.getEmployee()).isEqualTo(newEmployee);
        assertThat(diningOrder.getTable()).isEqualTo(newTable);

        verify(userService).findEntityById(NEW_EMPLOYEE_ID);
        verify(diningTableService).findEntityById(NEW_TABLE_ID);
    }

    @Test
    void mapTableIdToDiningTable_ValidId_ShouldReturnDiningTable() {
        
        when(diningTableService.findEntityById(TABLE_ID)).thenReturn(diningTable);

        DiningTable result = diningOrderMapper.mapTableIdToDiningTable(TABLE_ID);

        assertThat(result).isEqualTo(diningTable);
        verify(diningTableService).findEntityById(TABLE_ID);
    }

    @Test
    void mapTableIdToDiningTable_NullId_ShouldReturnNull() {
        
        DiningTable result = diningOrderMapper.mapTableIdToDiningTable(null);

        assertThat(result).isNull();
        verifyNoInteractions(diningTableService);
    }

    @Test
    void updateEntityFromDTO_WithNullCustomerNameAndNotes_ShouldSetToNull() {
        
        DiningOrderRequestDTO updateDTO = DiningOrderRequestDTO.builder()
                .employeeId(EMPLOYEE_ID)
                .tableId(TABLE_ID)
                .customerName(null)
                .notes(null)
                .build();

        when(userService.findEntityById(EMPLOYEE_ID)).thenReturn(employee);
        when(diningTableService.findEntityById(TABLE_ID)).thenReturn(diningTable);

        diningOrderMapper.updateEntityFromDTO(updateDTO, diningOrder);

        assertThat(diningOrder.getCustomerName()).isNull();
        assertThat(diningOrder.getNotes()).isNull();
        assertThat(diningOrder.getOrderNumber()).isEqualTo(ORDER_NUMBER);

        verify(userService).findEntityById(EMPLOYEE_ID);
        verify(diningTableService).findEntityById(TABLE_ID);
    }
}
