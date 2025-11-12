package es.ubu.inf.tfg.food;

import java.util.List;

import org.springframework.stereotype.Service;

import es.ubu.inf.tfg.exception.ResourceInUseException;
import es.ubu.inf.tfg.food.dto.FoodRequestDTO;
import es.ubu.inf.tfg.food.dto.FoodResponseDTO;
import es.ubu.inf.tfg.food.dto.mapper.FoodMapper;
import es.ubu.inf.tfg.food.foodGroup.FoodGroup;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class FoodService {
    
    private final FoodRepository foodRepository;
    private final FoodMapper foodMapper;


    public List<FoodResponseDTO> findAll() {
        return foodRepository.findAll().stream()
                .map(foodMapper::toResponseDTO)
                .toList();
    }

    public FoodResponseDTO findById(Integer id) {
        Food food = foodRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Food not found with id: " + id));
        return foodMapper.toResponseDTO(food);
    }

    public Food findEntityById(Integer id) {
        return foodRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Food not found with id: " + id));
    }

    public FoodResponseDTO findByName(String name) {
        Food food = foodRepository.findByName(name)
                .orElseThrow(() -> new EntityNotFoundException("Food not found with name: " + name));
        return foodMapper.toResponseDTO(food);
    }

    public List<FoodResponseDTO> findByFoodGroup(FoodGroup foodGroup) {
        return foodRepository.findByFoodGroup(foodGroup).stream()
                .map(foodMapper::toResponseDTO)
                .toList();
    }

    public List<FoodResponseDTO> findByNameContaining(String namePart) {
        return foodRepository.findByNameContainingIgnoreCase(namePart).stream()
                .map(foodMapper::toResponseDTO)
                .toList();
    }

    public boolean existsById(Integer id) {
        return foodRepository.existsById(id);
    }

    public boolean existsByName(String name) {
        return foodRepository.existsByName(name);
    }


    // --------------------------------------------------------
    // CRUD METHODS

    public FoodResponseDTO create(FoodRequestDTO foodRequest) {
        
        if (existsByName(foodRequest.getName())) {
            throw new IllegalArgumentException("Food with name '" + foodRequest.getName() + "' already exists");
        }

        Food food = foodMapper.toEntity(foodRequest);
        Food savedFood = foodRepository.save(food);
        return foodMapper.toResponseDTO(savedFood);
    }

    public FoodResponseDTO update(Integer id, FoodRequestDTO foodRequest) {
        
        Food existingFood = findEntityById(id);

        if (foodRequest.getName() != null && !foodRequest.getName().equals(existingFood.getName())) {
            if (existsByName(foodRequest.getName())) {
                throw new IllegalArgumentException("Food with name '" + foodRequest.getName() + "' already exists");
            }
            existingFood.setName(foodRequest.getName());
        }

        if (foodRequest.getFoodGroup() != null) {
            existingFood.setFoodGroup(foodRequest.getFoodGroup());
        }
        
        if (foodRequest.getServingWeightGrams() > 0) {
            existingFood.setServingWeightGrams(foodRequest.getServingWeightGrams());
        }
        
        if (foodRequest.getNutritionInfo() != null) {
            existingFood.setNutritionInfo(foodMapper.toNutritionInfoEntity(foodRequest.getNutritionInfo()));
        }

        Food updatedFood = foodRepository.save(existingFood);
        return foodMapper.toResponseDTO(updatedFood);
    }

    public void delete(Integer id) {
        
        Food food = findEntityById(id);

        if (!food.getUsages().isEmpty()) {
            throw new ResourceInUseException("Food", id, "Product");
        }
        foodRepository.delete(food);
    }
}
