package es.ubu.inf.tfg.reservation;

import es.ubu.inf.tfg.reservation.details.GuestInfo;
import es.ubu.inf.tfg.reservation.details.ReservationDetails;
import es.ubu.inf.tfg.reservation.details.ReservationStatus;
import es.ubu.inf.tfg.reservation.diningTable.DiningTable;
import es.ubu.inf.tfg.reservation.diningTable.DiningTableService;
import es.ubu.inf.tfg.reservation.dto.ReservationRequestDTO;
import es.ubu.inf.tfg.reservation.dto.ReservationResponseDTO;
import es.ubu.inf.tfg.reservation.dto.mapper.ReservationMapperImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class) 
class ReservationMapperTest {

    @InjectMocks
    private ReservationMapperImpl reservationMapper;

    @Mock
    private DiningTableService diningTableService;


    private static final Integer RES_ID = 1;
    private static final Integer TABLE_ID = 10;
    private static final String TABLE_NAME = "TAB-10";
    private static final String GUEST_FIRST = "Amanda";
    private static final String GUEST_LAST = "Pérez";
    private static final String GUEST_PHONE = "+34 111 111 111";
    private static final String GUEST_REQ = "2 guests are allergic to gluten";
    private static final Integer NUM_GUESTS = 3;
    private static final LocalDateTime RES_DATE = LocalDateTime.now().plusDays(1).withNano(0);
    private static final Integer DURATION = 90;
    private static final LocalDateTime CREATED_AT = LocalDateTime.now().minusDays(1).withNano(0);
    private static final LocalDateTime UPDATED_AT = LocalDateTime.now().withNano(0);

    private ReservationRequestDTO requestDTO;
    private Reservation reservationEntity;
    private DiningTable diningTable;


    @BeforeEach
    void setUp() {
        
        requestDTO = ReservationRequestDTO.builder()
                .diningTableId(TABLE_ID)
                .guestFirstName(GUEST_FIRST)
                .guestLastName(GUEST_LAST)
                .guestPhone(GUEST_PHONE)
                .guestSpecialRequests(GUEST_REQ)
                .numberOfGuests(NUM_GUESTS)
                .reservationDateTime(RES_DATE)
                .estimatedDurationMinutes(DURATION)
                .build();

        diningTable = DiningTable.builder()
                .id(TABLE_ID)
                .name(TABLE_NAME)
                .capacity(6)
                .isActive(true)
                .build();

        reservationEntity = Reservation.builder()
                .id(RES_ID)
                .status(ReservationStatus.CONFIRMED)
                .guestInfo(GuestInfo.builder()
                        .firstName(GUEST_FIRST)
                        .lastName(GUEST_LAST)
                        .phone(GUEST_PHONE)
                        .specialRequests(GUEST_REQ)
                        .build())
                .reservationDetails(ReservationDetails.builder()
                        .numberOfGuests(NUM_GUESTS)
                        .reservationDateTime(RES_DATE)
                        .estimatedDurationMinutes(DURATION)
                        .build())
                .diningTable(diningTable)
                .createdAt(CREATED_AT)
                .updatedAt(UPDATED_AT)
                .build();
    }

    @Test
    void toEntity_FromValidDTO_ShouldMapCorrectly() {
        
        when(diningTableService.findActiveTableById(TABLE_ID)).thenReturn(diningTable);

        Reservation entity = reservationMapper.toEntity(requestDTO);

        assertThat(entity).isNotNull();
        assertThat(entity.getId()).isNull();
        assertThat(entity.getDiningTable()).isNotNull();
        assertThat(entity.getGuestInfo().getFirstName()).isEqualTo(GUEST_FIRST);
        assertThat(entity.getReservationDetails().getNumberOfGuests()).isEqualTo(NUM_GUESTS);
        assertThat(entity.getReservationDetails().getReservationDateTime()).isEqualTo(RES_DATE);
        assertThat(entity.getReservationDetails().getEstimatedDurationMinutes()).isEqualTo(DURATION);
    }

    @Test
    void toEntity_FromNullDTO_ShouldReturnNull() {
        assertThat(reservationMapper.toEntity(null)).isNull();
    }

    @Test
    void toResponseDTO_FromValidEntity_ShouldMapCorrectly() {
        
        ReservationResponseDTO dto = reservationMapper.toResponseDTO(reservationEntity);

        assertThat(dto).isNotNull();
        assertThat(dto.getId()).isEqualTo(RES_ID);
        assertThat(dto.getGuestFirstName()).isEqualTo(GUEST_FIRST);
        assertThat(dto.getGuestLastName()).isEqualTo(GUEST_LAST);
        assertThat(dto.getGuestPhone()).isEqualTo(GUEST_PHONE);
        assertThat(dto.getGuestSpecialRequests()).isEqualTo(GUEST_REQ);
        assertThat(dto.getNumberOfGuests()).isEqualTo(NUM_GUESTS);
        assertThat(dto.getReservationDateTime()).isEqualTo(RES_DATE);
        assertThat(dto.getEstimatedDurationMinutes()).isEqualTo(DURATION);
        assertThat(dto.getDiningTableId()).isEqualTo(TABLE_ID);
        assertThat(dto.getDiningTableName()).isEqualTo(TABLE_NAME);
        assertThat(dto.getCreatedAt()).isEqualTo(CREATED_AT);
        assertThat(dto.getUpdatedAt()).isEqualTo(UPDATED_AT);
        assertThat(dto.getEstimatedEndTime()).isEqualTo(RES_DATE.plusMinutes(DURATION));
    }

    @Test
    void toResponseDTO_FromNullEntity_ShouldReturnNull() {
        assertThat(reservationMapper.toResponseDTO(null)).isNull();
    }

    @Test
    void updateEntityFromDTO_ShouldUpdateFields() {
        
        when(diningTableService.findActiveTableById(TABLE_ID)).thenReturn(diningTable);

        Reservation entity = Reservation.builder()
                .guestInfo(GuestInfo.builder().build())
                .reservationDetails(ReservationDetails.builder().build())
                .diningTable(diningTable)
                .build();

        reservationMapper.updateEntityFromDTO(requestDTO, entity);

        assertThat(entity.getGuestInfo().getFirstName()).isEqualTo(GUEST_FIRST);
        assertThat(entity.getReservationDetails().getNumberOfGuests()).isEqualTo(NUM_GUESTS);
        assertThat(entity.getReservationDetails().getReservationDateTime()).isEqualTo(RES_DATE);
    }
}
