package es.ubu.inf.tfg.food;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import es.ubu.inf.tfg.food.foodGroup.FoodGroup;

import jakarta.transaction.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class FoodService { // TODO: cambiar con DTO?
    
    private final FoodRepository foodRepository;


    public List<Food> findAll() {
        return foodRepository.findAll();
    }

    public Optional<Food> findById(Integer id) {
        return foodRepository.findById(id);
    }

    public Optional<Food> findByName(String name) {
        return foodRepository.findByName(name);
    }

    public boolean existsByName(String name) {
        return foodRepository.existsByName(name);
    }

    public List<Food> findByFoodGroup(FoodGroup foodGroup) {
        return foodRepository.findByFoodGroup(foodGroup);
    }

    public List<Food> findByNameContainingIgnoreCase(String namePart) {
        return foodRepository.findByNameContainingIgnoreCase(namePart);
    }

    // --------------------------------------------------------

    public Food create(Food food) {
        if (foodRepository.existsByName(food.getName())) {
            throw new IllegalArgumentException("Food with name " + food.getName() + " already exists.");
        }
        return foodRepository.save(food);
    }

    public Food update(Integer id, Food food) {
        
        Food existingFood = findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Food with ID " + id + " not found."));

        if (!existingFood.getName().equals(food.getName()) && foodRepository.existsByName(food.getName())) {
            throw new IllegalArgumentException("Food with name " + food.getName() + " already exists.");
        }

        if (food.getName() != null){
            existingFood.setName(food.getName());
        }
        existingFood.setFoodGroup(food.getFoodGroup());
        existingFood.setServingWeightGrams(food.getServingWeightGrams());
        existingFood.setNutritionInfo(food.getNutritionInfo());

        return foodRepository.save(existingFood);
    }

    public void delete(Integer id) {

        if (!foodRepository.existsById(id)){
            throw new IllegalArgumentException("Food with ID " + id + " not found.");
        }
        foodRepository.deleteById(id);
    }
}
