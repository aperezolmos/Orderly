package es.ubu.inf.tfg.recipe;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import es.ubu.inf.tfg.food.Food;
import es.ubu.inf.tfg.product.Product;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, RecipeId> {
    List<Recipe> findByFood(Food food);
    List<Recipe> findByProduct(Product product);
    void deleteByFood(Food food);
    void deleteByProduct(Product product);
}
