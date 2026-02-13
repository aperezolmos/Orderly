package es.ubu.inf.tfg.order.type.barOrder.dto.mapper;

import es.ubu.inf.tfg.order.orderItem.OrderItem;
import es.ubu.inf.tfg.order.orderItem.dto.mapper.OrderItemMapper;
import es.ubu.inf.tfg.order.type.barOrder.BarOrder;
import es.ubu.inf.tfg.order.type.barOrder.dto.BarOrderRequestDTO;
import es.ubu.inf.tfg.order.type.barOrder.dto.BarOrderResponseDTO;
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
class BarOrderMapperTest {

    @InjectMocks
    private BarOrderMapperImpl barOrderMapper;

    @Mock
    private UserService userService;
    @Mock
    private OrderItemMapper orderItemMapper;


    private static final Integer EMPLOYEE_ID = 1;
    private static final String EMPLOYEE_USERNAME = "amanda";
    private static final String ORDER_NUMBER = "BAR-001";
    private static final String ORDER_TYPE_BAR = "BAR";
    private static final String CUSTOMER_NAME = "Bar Customer";
    private static final String NOTES = "No ice";
    private static final Boolean DRINKS_ONLY = true;

    private User employee;
    private BarOrderRequestDTO barOrderRequestDTO;
    private BarOrder barOrder;
    private OrderItem orderItem;


    @BeforeEach
    void setUp() {
        
        employee = User.builder()
                .id(EMPLOYEE_ID)
                .username(EMPLOYEE_USERNAME)
                .build();

        orderItem = OrderItem.builder()
                .id(1)
                .quantity(2)
                .unitPrice(new BigDecimal("5.00"))
                .totalPrice(new BigDecimal("10.00"))
                .build();

        barOrderRequestDTO = BarOrderRequestDTO.builder()
                .orderNumber(ORDER_NUMBER)
                .orderType(ORDER_TYPE_BAR)
                .customerName(CUSTOMER_NAME)
                .notes(NOTES)
                .employeeId(EMPLOYEE_ID)
                .drinksOnly(DRINKS_ONLY)
                .build();

        barOrder = BarOrder.builder()
                .id(1)
                .orderNumber(ORDER_NUMBER)
                .customerName(CUSTOMER_NAME)
                .notes(NOTES)
                .employee(employee)
                .drinksOnly(DRINKS_ONLY)
                .build();
    }

    @Test
    void toEntity_ValidBarOrderRequestDTO_ShouldMapCorrectly() {
        
        when(userService.findEntityById(EMPLOYEE_ID)).thenReturn(employee);

        BarOrder result = barOrderMapper.toEntity(barOrderRequestDTO);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isNull();
        assertThat(result.getOrderNumber()).isEqualTo(ORDER_NUMBER);
        assertThat(result.getCustomerName()).isEqualTo(CUSTOMER_NAME);
        assertThat(result.getNotes()).isEqualTo(NOTES);
        assertThat(result.getEmployee()).isEqualTo(employee);
        assertThat(result.getDrinksOnly()).isTrue();

        verify(userService).findEntityById(EMPLOYEE_ID);
    }

    @Test
    void toEntity_WithNullFields_ShouldMapWithDefaults() {
        
        BarOrderRequestDTO requestWithNulls = BarOrderRequestDTO.builder()
                .employeeId(EMPLOYEE_ID)
                .orderType(ORDER_TYPE_BAR)
                .drinksOnly(false)
                .build();

        when(userService.findEntityById(EMPLOYEE_ID)).thenReturn(employee);

        BarOrder result = barOrderMapper.toEntity(requestWithNulls);

        assertThat(result).isNotNull();
        assertThat(result.getCustomerName()).isNull();
        assertThat(result.getNotes()).isNull();

        verify(userService).findEntityById(EMPLOYEE_ID);
    }

    @Test
    void toResponseDTO_ValidBarOrder_ShouldMapCorrectly() {
        
        BarOrderResponseDTO result = barOrderMapper.toResponseDTO(barOrder);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(barOrder.getId());
        assertThat(result.getOrderNumber()).isEqualTo(ORDER_NUMBER);
        assertThat(result.getCustomerName()).isEqualTo(CUSTOMER_NAME);
        assertThat(result.getNotes()).isEqualTo(NOTES);
        assertThat(result.getOrderType()).isEqualTo(ORDER_TYPE_BAR);
        assertThat(result.getEmployeeId()).isEqualTo(EMPLOYEE_ID);
        assertThat(result.getEmployeeName()).isEqualTo(EMPLOYEE_USERNAME);
        assertThat(result.getDrinksOnly()).isTrue();
        assertThat(result.getItems()).isNull();
    }

    @Test
    void toDetailedResponseDTO_ValidBarOrder_ShouldMapWithItems() {
        
        barOrder.setItems(List.of(orderItem));

        BarOrderResponseDTO result = barOrderMapper.toDetailedResponseDTO(barOrder);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(barOrder.getId());
        assertThat(result.getOrderNumber()).isEqualTo(ORDER_NUMBER);
        assertThat(result.getOrderType()).isEqualTo(ORDER_TYPE_BAR);
        assertThat(result.getEmployeeId()).isEqualTo(EMPLOYEE_ID);
        assertThat(result.getEmployeeName()).isEqualTo(EMPLOYEE_USERNAME);
        assertThat(result.getDrinksOnly()).isTrue();
        assertThat(result.getItems()).isNotNull();
        assertThat(result.getItems()).hasSize(1);
    }

    @Test
    void updateEntityFromDTO_ValidBarOrderRequestDTO_ShouldUpdateFields() {
        
        String ORDER_NUMBER_UPDATED = "BAR-UPDATED";
        String CUSTOMER_NAME_UPDATED = "Updated Customer";
        String NOTES_UPDATED = "Updated notes";
        Integer NEW_EMPLOYEE_ID = 2;

        BarOrderRequestDTO updateDTO = BarOrderRequestDTO.builder()
                .orderNumber(ORDER_NUMBER_UPDATED)
                .customerName(CUSTOMER_NAME_UPDATED)
                .notes(NOTES_UPDATED)
                .employeeId(NEW_EMPLOYEE_ID)
                .drinksOnly(false)
                .build();

        User newEmployee = User.builder()
                .id(NEW_EMPLOYEE_ID)
                .username("ana")
                .build();

        when(userService.findEntityById(NEW_EMPLOYEE_ID)).thenReturn(newEmployee);

        
        barOrderMapper.updateEntityFromDTO(updateDTO, barOrder);

        assertThat(barOrder.getOrderNumber()).isEqualTo(ORDER_NUMBER_UPDATED);
        assertThat(barOrder.getCustomerName()).isEqualTo(CUSTOMER_NAME_UPDATED);
        assertThat(barOrder.getNotes()).isEqualTo(NOTES_UPDATED);
        assertThat(barOrder.getEmployee()).isEqualTo(newEmployee);
        assertThat(barOrder.getDrinksOnly()).isFalse();

        verify(userService).findEntityById(NEW_EMPLOYEE_ID);
    }

    @Test
    void updateEntityFromDTO_WithNullFields_ShouldSetToNull() {
        
        BarOrderRequestDTO updateDTO = BarOrderRequestDTO.builder()
                .employeeId(EMPLOYEE_ID)
                .customerName(null)
                .notes(null)
                .build();

        when(userService.findEntityById(EMPLOYEE_ID)).thenReturn(employee);

        
        barOrderMapper.updateEntityFromDTO(updateDTO, barOrder);

        assertThat(barOrder.getCustomerName()).isNull();
        assertThat(barOrder.getNotes()).isNull();
        assertThat(barOrder.getOrderNumber()).isEqualTo(ORDER_NUMBER);
        assertThat(barOrder.getDrinksOnly()).isTrue();

        verify(userService).findEntityById(EMPLOYEE_ID);
    }

    @Test
    void mapEmployeeIdToUser_ValidId_ShouldReturnUser() {
        
        when(userService.findEntityById(EMPLOYEE_ID)).thenReturn(employee);

        User result = barOrderMapper.mapEmployeeIdToUser(EMPLOYEE_ID);

        assertThat(result).isEqualTo(employee);
        verify(userService).findEntityById(EMPLOYEE_ID);
    }

    @Test
    void mapEmployeeIdToUser_NullId_ShouldReturnNull() {
        
        User result = barOrderMapper.mapEmployeeIdToUser(null);

        assertThat(result).isNull();
        verifyNoInteractions(userService);
    }
}
