package es.ubu.inf.tfg.init;

import es.ubu.inf.tfg.reservation.ReservationRepository;
import es.ubu.inf.tfg.reservation.ReservationService;
import es.ubu.inf.tfg.reservation.dto.ReservationRequestDTO;
import es.ubu.inf.tfg.reservation.diningTable.DiningTableService;
import es.ubu.inf.tfg.reservation.diningTable.dto.DiningTableResponseDTO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

import java.time.LocalDateTime;
import java.util.List;

@Component
@Order(5)
@RequiredArgsConstructor
@Slf4j
@ConditionalOnProperty(name = "APP_INIT_DEMO_DATA", havingValue = "true")
public class ReservationDataInitializer implements CommandLineRunner {

    private final ReservationRepository reservationRepository;
    private final ReservationService reservationService;
    private final DiningTableService diningTableService;


    @Override
    public void run(String... args) {
        
        if (reservationRepository.count() > 0) {
            log.info("Reservation table already contains data. Skipping ReservationDataInitializer");
            return;
        }

        List<DiningTableResponseDTO> tables = diningTableService.findAll();
        if (tables.isEmpty()) {
            log.warn("No dining tables found. Skipping ReservationDataInitializer");
            return;
        }

        LocalDateTime now = LocalDateTime.now();


        ReservationRequestDTO res1 = ReservationRequestDTO.builder()
            .diningTableId(tables.get(0).getId())
            .guestFirstName("Ana")
            .guestLastName("García")
            .guestPhone("600123456")
            .guestSpecialRequests("Sin gluten")
            .numberOfGuests(2)
            .reservationDateTime(now.plusDays(2).withHour(20).withMinute(0))
            .estimatedDurationMinutes(90)
            .build();

        ReservationRequestDTO res2 = ReservationRequestDTO.builder()
            .diningTableId(tables.size() > 1 ? tables.get(1).getId() : tables.get(0).getId())
            .guestFirstName("Luis")
            .guestLastName("Martínez")
            .guestPhone("600654321")
            .numberOfGuests(4)
            .reservationDateTime(now.plusDays(5).withHour(21).withMinute(30))
            .estimatedDurationMinutes(120)
            .build();

        ReservationRequestDTO res3 = ReservationRequestDTO.builder()
            .diningTableId(tables.size() > 2 ? tables.get(2).getId() : tables.get(0).getId())
            .guestFirstName("María")
            .guestLastName("López")
            .guestPhone("611222333")
            .guestSpecialRequests("Mesa cerca de la ventana")
            .numberOfGuests(3)
            .reservationDateTime(now.plusDays(10).withHour(19).withMinute(45))
            .estimatedDurationMinutes(60)
            .build();
        

        reservationService.create(res1);
        reservationService.create(res2);
        reservationService.create(res3);

        log.info("Inserted demo reservations");
    }
}
