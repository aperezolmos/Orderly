package es.ubu.inf.tfg.food;

import java.util.List;

import org.springframework.stereotype.Service;

import es.ubu.inf.tfg.food.foodGroup.FoodGroup;

import jakarta.persistence.EntityNotFoundException;
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

    public Food findById(Integer id) {
        return foodRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Food not found with id: " + id));
    }

    public Food findByName(String name) {
        return foodRepository.findByName(name)
                .orElseThrow(() -> new EntityNotFoundException("Food not found with name: " + name));
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
            throw new IllegalArgumentException("Food with name '" + food.getName() + "'' already exists");
        }
        return foodRepository.save(food);
    }

    public Food update(Integer id, Food food) {
        
        Food existingFood = findById(id);

        if (food.getName() != null && !food.getName().equals(existingFood.getName())) {
            if (foodRepository.existsByName(food.getName())) {
                throw new IllegalArgumentException("Food with name '" + food.getName() + "' already exists");
            }
            existingFood.setName(food.getName());
        }

        if (food.getFoodGroup() != null) {
            existingFood.setFoodGroup(food.getFoodGroup());
        }
        
        if (food.getServingWeightGrams() > 0) {
            existingFood.setServingWeightGrams(food.getServingWeightGrams());
        }
        
        existingFood.setNutritionInfo(food.getNutritionInfo());

        return foodRepository.save(existingFood);
    }

    public void delete(Integer id) {

        //TODO: manejar cuando tiene recetas asociadas?
        // hay cascade y orphan removal, pero se debería notificar al usuario

        if (!foodRepository.existsById(id)){
            throw new IllegalArgumentException("Food with ID " + id + " not found");
        }
        foodRepository.deleteById(id);
    }
}
