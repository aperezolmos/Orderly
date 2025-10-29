package es.ubu.inf.tfg.product;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer>{
    Optional<Product> findByName(String name);
    boolean existsByName(String name);
    List<Product> findByNameContainingIgnoreCase(String namePart);
    List<Product> findByPriceLessThanEqual(Double maxPrice);

    // Consulta inversa a través de la relación
    List<Product> findByRecipes_FoodId(Integer foodId);
    boolean existsByRecipes_FoodId(Integer foodId);
}
