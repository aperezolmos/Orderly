package es.ubu.inf.tfg.recipe;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecipeRepository extends JpaRepository<Recipe, RecipeId> {
    List<Recipe> findByFoodId(Integer foodId);
    List<Recipe> findByProductId(Integer productId);
    void deleteByFoodId(Integer foodId);
    void deleteByProductId(Integer productId);
}
