package es.ubu.inf.tfg.init;

import es.ubu.inf.tfg.reservation.diningTable.DiningTable;
import es.ubu.inf.tfg.reservation.diningTable.DiningTableRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

import java.util.List;

@Component
@Order(3)
@RequiredArgsConstructor
@Slf4j
@ConditionalOnProperty(name = "APP_INIT_DEMO_DATA", havingValue = "true")
public class DiningTableDataInitializer implements CommandLineRunner {

    private final DiningTableRepository diningTableRepository;


    @Override
    public void run(String... args) {
        
        if (diningTableRepository.count() > 0) {
            log.info("DiningTable table already contains data. Skipping DiningTableDataInitializer");
            return;
        }

        List<DiningTable> tables = List.of(
            DiningTable.builder()
                .name("M1")
                .capacity(2)
                .locationDescription("Ventana")
                .isActive(true)
                .build(),
            DiningTable.builder()
                .name("M2")
                .capacity(4)
                .locationDescription("Centro")
                .isActive(true)
                .build(),
            DiningTable.builder()
                .name("M3")
                .capacity(6)
                .locationDescription("Terraza")
                .isActive(true)
                .build(),
            DiningTable.builder()
                .name("M4")
                .capacity(8)
                .locationDescription("Sala privada")
                .isActive(true)
                .build()
        );

        diningTableRepository.saveAll(tables);
        log.info("Inserted demo dining tables: {}", tables.stream().map(DiningTable::getName).toList());
    }
}
