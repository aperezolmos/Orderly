package es.ubu.inf.tfg.reservation;

import es.ubu.inf.tfg.reservation.diningTable.DiningTable;
import es.ubu.inf.tfg.reservation.diningTable.DiningTableRepository;
import es.ubu.inf.tfg.reservation.dto.ReservationRequestDTO;
import es.ubu.inf.tfg.reservation.dto.ReservationResponseDTO;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.*;

@SpringBootTest
@Transactional
class ReservationServiceIntegrationTest {

    @Autowired
    private ReservationService reservationService;
    @Autowired
    private DiningTableRepository diningTableRepository;


    private static final String GUEST_FIRST_NAME_BASE = "Guest";
    private static final String GUEST_LAST_NAME_BASE = "User";
    private static final String GUEST_PHONE_BASE = "60000000";
    private static final String TABLE_NAME_BASE = "T-TEST";
    private static final Integer DEFAULT_CAPACITY = 4;
    private static final Integer DEFAULT_GUESTS = 2;
    private static final Integer DEFAULT_DURATION = 60;
    private static final Integer LARGE_CAPACITY = 6;
    private static final Integer LARGE_GUESTS = 5;
    private static final Integer LONG_DURATION = 90;

    private static final String INACTIVE_TABLE_NAME = "T-INAC";
    private static final String CHANGE_TABLE_NAME = "T-CHNG";
    private static final String CONFLICT_GUEST_FIRST_A = "ConflictA";
    private static final String CONFLICT_GUEST_FIRST_B = "ConflictB";
    private static final String CONFLICT_GUEST_FIRST_C = "ConflictC";
    private static final String CONFLICT_GUEST_LAST_A = "ConflictLastA";
    private static final String CONFLICT_GUEST_LAST_B = "ConflictLastB";
    private static final String CONFLICT_GUEST_LAST_C = "ConflictLastC";
    private static final String CONFLICT_PHONE_A = "111111111";
    private static final String CONFLICT_PHONE_B = "222222222";
    private static final String CONFLICT_PHONE_C = "333333333";
    private static final String UPDATE_GUEST_FIRST = "UpdateGuest";
    private static final String UPDATE_GUEST_LAST = "UpdateLast";
    private static final String UPDATE_PHONE = "444444444";

    private DiningTable table;
    private LocalDateTime baseDateTime;


    @BeforeEach
    void setUp() {
        
        baseDateTime = LocalDateTime.now().withNano(0);
        
        table = DiningTable.builder()
                .name(TABLE_NAME_BASE + "-1")
                .capacity(DEFAULT_CAPACITY)
                .isActive(true)
                .build();
        diningTableRepository.save(table);
    }


    // --------------------------------------------------------

    @Test
    void createReservation_ShouldPersistAndLinkToTable() {
        ReservationRequestDTO request = buildReservationRequestDTO(
            table.getId(),
            GUEST_FIRST_NAME_BASE + "1",
            GUEST_LAST_NAME_BASE + "1",
            GUEST_PHONE_BASE + "1",
            DEFAULT_GUESTS,
            baseDateTime.plusDays(2),
            DEFAULT_DURATION
        );

        ReservationResponseDTO response = reservationService.create(request);

        assertThat(response.getId()).isNotNull();
        assertThat(response.getDiningTableId()).isEqualTo(table.getId());
        assertThat(response.getDiningTableName()).isEqualTo(table.getName());
        assertThat(response.getNumberOfGuests()).isEqualTo(DEFAULT_GUESTS);
    }

    @Test
    void createReservation_Conflicting_ShouldThrowException() {
        
        LocalDateTime reservationDate = baseDateTime.plusDays(3);

        ReservationRequestDTO firstRequest = buildReservationRequestDTO(
            table.getId(),
            CONFLICT_GUEST_FIRST_A,
            CONFLICT_GUEST_LAST_A,
            CONFLICT_PHONE_A,
            DEFAULT_GUESTS,
            reservationDate,
            LONG_DURATION
        );

        ReservationRequestDTO secondRequest = buildReservationRequestDTO(
            table.getId(),
            CONFLICT_GUEST_FIRST_B,
            CONFLICT_GUEST_LAST_B,
            CONFLICT_PHONE_B,
            DEFAULT_GUESTS,
            reservationDate.plusMinutes(30),
            LONG_DURATION
        );

        reservationService.create(firstRequest);

        assertThatThrownBy(() -> reservationService.create(secondRequest))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("already reserved");
    }

    @Test
    void createReservation_DifferentTable_NoConflict() {
        
        DiningTable secondTable = buildDiningTable(TABLE_NAME_BASE + "-2", DEFAULT_CAPACITY, true);
        diningTableRepository.save(secondTable);

        LocalDateTime reservationDate = baseDateTime.plusDays(4);

        ReservationRequestDTO firstRequest = buildReservationRequestDTO(
            table.getId(),
            CONFLICT_GUEST_FIRST_A,
            CONFLICT_GUEST_LAST_A,
            CONFLICT_PHONE_A,
            DEFAULT_GUESTS,
            reservationDate,
            LONG_DURATION
        );

        ReservationRequestDTO secondRequest = buildReservationRequestDTO(
            secondTable.getId(),
            CONFLICT_GUEST_FIRST_C,
            CONFLICT_GUEST_LAST_C,
            CONFLICT_PHONE_C,
            DEFAULT_GUESTS,
            reservationDate,
            LONG_DURATION
        );

        ReservationResponseDTO firstResponse = reservationService.create(firstRequest);
        ReservationResponseDTO secondResponse = reservationService.create(secondRequest);

        assertThat(firstResponse.getDiningTableId()).isNotEqualTo(secondResponse.getDiningTableId());
    }

    @Test
    void createReservation_AdjacentTimes_NoConflict() {
        
        LocalDateTime startTime = baseDateTime.plusDays(5);

        ReservationRequestDTO firstRequest = buildReservationRequestDTO(
            table.getId(),
            CONFLICT_GUEST_FIRST_A,
            CONFLICT_GUEST_LAST_A,
            CONFLICT_PHONE_A,
            DEFAULT_GUESTS,
            startTime,
            DEFAULT_DURATION
        );

        ReservationRequestDTO secondRequest = buildReservationRequestDTO(
            table.getId(),
            CONFLICT_GUEST_FIRST_B,
            CONFLICT_GUEST_LAST_B,
            CONFLICT_PHONE_B,
            DEFAULT_GUESTS,
            startTime.plusMinutes(DEFAULT_DURATION),
            DEFAULT_DURATION
        );

        ReservationResponseDTO firstResponse = reservationService.create(firstRequest);
        ReservationResponseDTO secondResponse = reservationService.create(secondRequest);

        assertThat(firstResponse.getDiningTableId()).isEqualTo(table.getId());
        assertThat(secondResponse.getDiningTableId()).isEqualTo(table.getId());
        assertThat(secondResponse.getReservationDateTime())
            .isEqualTo(firstResponse.getReservationDateTime().plusMinutes(DEFAULT_DURATION));
    }

    @Test
    void createReservation_OnInactiveTable_ShouldThrowException() {
        
        DiningTable inactiveTable = buildDiningTable(INACTIVE_TABLE_NAME, DEFAULT_CAPACITY, false);
        diningTableRepository.save(inactiveTable);

        ReservationRequestDTO request = buildReservationRequestDTO(
            inactiveTable.getId(),
            GUEST_FIRST_NAME_BASE + "2",
            GUEST_LAST_NAME_BASE + "2",
            GUEST_PHONE_BASE + "2",
            DEFAULT_GUESTS,
            baseDateTime.plusDays(2),
            DEFAULT_DURATION
        );

        assertThatThrownBy(() -> reservationService.create(request))
                .isInstanceOf(jakarta.persistence.EntityNotFoundException.class)
                .hasMessageContaining("not found or not active");
    }

    @Test
    void updateReservation_ChangeTableAndGuests_ShouldUpdateCorrectly() {
        
        DiningTable secondTable = buildDiningTable(CHANGE_TABLE_NAME, LARGE_CAPACITY, true);
        diningTableRepository.save(secondTable);

        ReservationRequestDTO createRequest = buildReservationRequestDTO(
            table.getId(),
            UPDATE_GUEST_FIRST,
            UPDATE_GUEST_LAST,
            UPDATE_PHONE,
            DEFAULT_GUESTS,
            baseDateTime.plusDays(6),
            DEFAULT_DURATION
        );

        ReservationResponseDTO createdResponse = reservationService.create(createRequest);

        ReservationRequestDTO updateRequest = buildReservationRequestDTO(
            secondTable.getId(),
            UPDATE_GUEST_FIRST,
            UPDATE_GUEST_LAST,
            UPDATE_PHONE,
            LARGE_GUESTS,
            createRequest.getReservationDateTime(),
            DEFAULT_DURATION
        );

        ReservationResponseDTO updatedResponse = reservationService.update(createdResponse.getId(), updateRequest);

        assertThat(updatedResponse.getDiningTableId()).isEqualTo(secondTable.getId());
        assertThat(updatedResponse.getNumberOfGuests()).isEqualTo(LARGE_GUESTS);
    }

    
    // --------------------------------------------------------

    private ReservationRequestDTO buildReservationRequestDTO(
            Integer tableId, String firstName, String lastName, 
            String phone, Integer guests, LocalDateTime dateTime, Integer duration) {
        
        return ReservationRequestDTO.builder()
                .diningTableId(tableId)
                .guestFirstName(firstName)
                .guestLastName(lastName)
                .guestPhone(phone)
                .numberOfGuests(guests)
                .reservationDateTime(dateTime)
                .estimatedDurationMinutes(duration)
                .build();
    }

    private DiningTable buildDiningTable(String name, Integer capacity, Boolean isActive) {
        return DiningTable.builder()
                .name(name)
                .capacity(capacity)
                .isActive(isActive)
                .build();
    }
}
