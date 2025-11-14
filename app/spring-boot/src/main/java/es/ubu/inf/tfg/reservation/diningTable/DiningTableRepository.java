package es.ubu.inf.tfg.reservation.diningTable;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DiningTableRepository extends JpaRepository<DiningTable, Integer> {
    Optional<DiningTable> findByName(String name);
    boolean existsByName(String name);
    List<DiningTable> findByIsActiveTrueAndIsAvailableTrue();
    List<DiningTable> findByIsActiveTrueAndIsAvailableTrueAndCapacityGreaterThanEqual(Integer minCapacity);
}
