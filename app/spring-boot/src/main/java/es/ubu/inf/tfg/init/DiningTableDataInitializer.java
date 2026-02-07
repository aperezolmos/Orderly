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
                .name("T1")
                .capacity(2)
                .locationDescription("Window")
                .isActive(true)
                .build(),
            DiningTable.builder()
                .name("T2")
                .capacity(4)
                .locationDescription("Center")
                .isActive(true)
                .build(),
            DiningTable.builder()
                .name("T3")
                .capacity(6)
                .locationDescription("Terrace")
                .isActive(true)
                .build(),
            DiningTable.builder()
                .name("T4")
                .capacity(8)
                .locationDescription("Private Room")
                .isActive(true)
                .build()
        );

        diningTableRepository.saveAll(tables);
        log.info("Inserted demo dining tables: {}", tables.stream().map(DiningTable::getName).toList());
    }
}
