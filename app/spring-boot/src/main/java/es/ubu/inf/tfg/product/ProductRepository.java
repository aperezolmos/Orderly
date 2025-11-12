package es.ubu.inf.tfg.product;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer>{
    Optional<Product> findByName(String name);
    boolean existsByName(String name);
    List<Product> findByNameContainingIgnoreCase(String namePart);
    List<Product> findByPriceLessThanEqual(Double maxPrice);

    // Domain-specific queries using the 'ingredients' relationship
    @Query("SELECT p FROM Product p JOIN p.ingredients i WHERE i.food.id = :foodId")
    List<Product> findByIngredients_FoodId(@Param("foodId") Integer foodId);
    
    @Query("SELECT CASE WHEN COUNT(i) > 0 THEN true ELSE false END FROM Product p JOIN p.ingredients i WHERE i.food.id = :foodId")
    boolean existsByIngredients_FoodId(@Param("foodId") Integer foodId);
}
