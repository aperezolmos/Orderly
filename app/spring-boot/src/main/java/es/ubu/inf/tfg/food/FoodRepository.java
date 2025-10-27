package es.ubu.inf.tfg.food;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import es.ubu.inf.tfg.food.foodGroup.FoodGroup;

@Repository
public interface FoodRepository extends JpaRepository<Food, Integer> {
    Optional<Food> findByName(String name);
    boolean existsByName(String name);
    List<Food> findByFoodGroup(FoodGroup foodGroup);
    List<Food> findByNameContainingIgnoreCase(String namePart);

    //++ encontrar todos los alimentos cuya fecha de actualización sea mayor que cierto valor -> para ver si necesitan ser actualizados
}
