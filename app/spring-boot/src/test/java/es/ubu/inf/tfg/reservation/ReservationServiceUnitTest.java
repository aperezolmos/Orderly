package es.ubu.inf.tfg.reservation;

import es.ubu.inf.tfg.reservation.details.ReservationDetails;
import es.ubu.inf.tfg.reservation.details.ReservationStatus;
import es.ubu.inf.tfg.reservation.diningTable.DiningTable;
import es.ubu.inf.tfg.reservation.diningTable.DiningTableService;
import es.ubu.inf.tfg.reservation.dto.ReservationRequestDTO;
import es.ubu.inf.tfg.reservation.dto.ReservationResponseDTO;
import es.ubu.inf.tfg.reservation.dto.mapper.ReservationMapper;

import jakarta.persistence.EntityNotFoundException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReservationServiceUnitTest {

    @InjectMocks
    private ReservationService reservationService;

    @Mock
    private ReservationRepository reservationRepository;
    @Mock
    private ReservationMapper reservationMapper;
    @Mock
    private DiningTableService diningTableService;
    

    private static final Integer RES_ID = 1;
    private static final Integer TABLE_ID = 10;
    private static final String GUEST_FIRST = "Amanda";
    private static final String GUEST_LAST = "Pérez";
    private static final String GUEST_PHONE = "123456789";
    private static final Integer NUM_GUESTS = 3;
    private static final LocalDateTime FUTURE_DATE = LocalDateTime.now().plusDays(1).withNano(0);

    private ReservationRequestDTO requestDTO;
    private DiningTable diningTable;
    private Reservation reservationEntity;
    private ReservationResponseDTO responseDTO;


    @BeforeEach
    void setUp() {
        
        requestDTO = ReservationRequestDTO.builder()
                .diningTableId(TABLE_ID)
                .guestFirstName(GUEST_FIRST)
                .guestLastName(GUEST_LAST)
                .guestPhone(GUEST_PHONE)
                .numberOfGuests(NUM_GUESTS)
                .reservationDateTime(FUTURE_DATE)
                .estimatedDurationMinutes(90)
                .build();

        diningTable = DiningTable.builder()
                .id(TABLE_ID)
                .capacity(4)
                .isActive(true)
                .build();

        reservationEntity = Reservation.builder()
                .id(RES_ID)
                .status(ReservationStatus.CONFIRMED)
                .reservationDetails(ReservationDetails.builder()
                        .numberOfGuests(NUM_GUESTS)
                        .reservationDateTime(FUTURE_DATE)
                        .estimatedDurationMinutes(90)
                        .build())
                .diningTable(diningTable)
                .build();

        responseDTO = ReservationResponseDTO.builder()
                .id(RES_ID)
                .numberOfGuests(NUM_GUESTS)
                .reservationDateTime(FUTURE_DATE)
                .build();
    }


    // --------------------------------------------------------

    @Test
    void findById_ExistingId_ShouldReturnDTO() {
        
        when(reservationRepository.findById(RES_ID)).thenReturn(Optional.of(reservationEntity));
        when(reservationMapper.toResponseDTO(reservationEntity)).thenReturn(responseDTO);

        ReservationResponseDTO result = reservationService.findById(RES_ID);

        assertThat(result).isEqualTo(responseDTO);
    }

    @Test
    void findById_NonExistingId_ShouldThrowException() {
        
        when(reservationRepository.findById(RES_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> reservationService.findById(RES_ID))
                .isInstanceOf(EntityNotFoundException.class);
    }

    @Test
    void create_ValidRequest_ShouldSaveAndReturnDTO() {
        
        when(diningTableService.findEntityById(TABLE_ID)).thenReturn(diningTable);
        when(reservationRepository.findConflictingReservations(any(), any(), any())).thenReturn(List.of());
        when(reservationMapper.toEntity(requestDTO)).thenReturn(reservationEntity);
        when(reservationRepository.save(reservationEntity)).thenReturn(reservationEntity);
        when(reservationMapper.toResponseDTO(reservationEntity)).thenReturn(responseDTO);

        ReservationResponseDTO result = reservationService.create(requestDTO);

        assertThat(result).isEqualTo(responseDTO);
        verify(reservationRepository).save(reservationEntity);
    }

    @Test
    void create_ReservationInPast_ShouldThrowException() {
        
        ReservationRequestDTO pastRequest = ReservationRequestDTO.builder()
                .diningTableId(TABLE_ID)
                .guestFirstName(GUEST_FIRST)
                .guestLastName(GUEST_LAST)
                .guestPhone(GUEST_PHONE)
                .numberOfGuests(NUM_GUESTS)
                .reservationDateTime(LocalDateTime.now().minusDays(1))
                .build();

        assertThatThrownBy(() -> reservationService.create(pastRequest))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("future");
    }

    @Test
    void create_TooManyGuests_ShouldThrowException() {
        
        ReservationRequestDTO tooManyGuests = ReservationRequestDTO.builder()
                .diningTableId(TABLE_ID)
                .guestFirstName(GUEST_FIRST)
                .guestLastName(GUEST_LAST)
                .guestPhone(GUEST_PHONE)
                .numberOfGuests(10)
                .reservationDateTime(FUTURE_DATE)
                .build();

        when(diningTableService.findEntityById(TABLE_ID)).thenReturn(diningTable);

        assertThatThrownBy(() -> reservationService.create(tooManyGuests))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("exceeds table capacity");
    }

    @Test
    void create_ConflictingReservation_ShouldThrowException() {
        
        when(diningTableService.findEntityById(TABLE_ID)).thenReturn(diningTable);
        when(reservationRepository.findConflictingReservations(any(), any(), any()))
                .thenReturn(List.of(reservationEntity));

        assertThatThrownBy(() -> reservationService.create(requestDTO))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("already reserved");
    }

    @Test
    void updateStatus_ValidTransition_ShouldUpdateStatus() {
        
        Reservation entity = Reservation.builder()
                .id(RES_ID)
                .status(ReservationStatus.CONFIRMED)
                .reservationDetails(ReservationDetails.builder()
                        .numberOfGuests(NUM_GUESTS)
                        .reservationDateTime(FUTURE_DATE)
                        .build())
                .diningTable(diningTable)
                .build();

        when(reservationRepository.findById(RES_ID)).thenReturn(Optional.of(entity));
        when(reservationRepository.save(entity)).thenReturn(entity);
        when(reservationMapper.toResponseDTO(entity)).thenReturn(responseDTO);

        ReservationResponseDTO result = reservationService.updateStatus(RES_ID, ReservationStatus.SEATED);

        assertThat(result).isEqualTo(responseDTO);
        assertThat(entity.getStatus()).isEqualTo(ReservationStatus.SEATED);
    }

    @Test
    void updateStatus_InvalidTransition_ShouldThrowException() {
        
        Reservation entity = Reservation.builder()
                .id(RES_ID)
                .status(ReservationStatus.CANCELLED)
                .build();

        when(reservationRepository.findById(RES_ID)).thenReturn(Optional.of(entity));

        assertThatThrownBy(() -> reservationService.updateStatus(RES_ID, ReservationStatus.CONFIRMED))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Cannot change status");
    }
}
