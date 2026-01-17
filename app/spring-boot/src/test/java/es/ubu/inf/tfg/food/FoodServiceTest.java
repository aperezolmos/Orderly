package es.ubu.inf.tfg.food;

import es.ubu.inf.tfg.exception.ResourceInUseException;
import es.ubu.inf.tfg.food.classification.FoodGroup;
import es.ubu.inf.tfg.food.dto.FoodRequestDTO;
import es.ubu.inf.tfg.food.dto.FoodResponseDTO;
import es.ubu.inf.tfg.food.dto.mapper.FoodMapper;
import es.ubu.inf.tfg.food.nutritionInfo.NutritionInfo;
import es.ubu.inf.tfg.product.ingredient.Ingredient;
import jakarta.persistence.EntityNotFoundException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;

import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FoodServiceTest {

    @InjectMocks
    private FoodService foodService;

    @Mock
    private FoodRepository foodRepository;
    @Mock
    private FoodMapper foodMapper;


    private static final Integer FOOD_ID = 1;
    private static final String FOOD_NAME = "Apple";
    private static final FoodGroup FOOD_GROUP = FoodGroup.FRUIT;
    private static final BigDecimal SERVING_WEIGHT = new BigDecimal("150");
    private static final LocalDateTime CREATED_AT = LocalDateTime.now().minusDays(1);
    private static final LocalDateTime UPDATED_AT = LocalDateTime.now();

    private Food foodEntity;
    private FoodRequestDTO foodRequestDTO;
    private FoodResponseDTO foodResponseDTO;


    @BeforeEach
    void setUp() {
        
        foodEntity = Food.builder()
                .id(FOOD_ID)
                .name(FOOD_NAME)
                .foodGroup(FOOD_GROUP)
                .servingWeightGrams(SERVING_WEIGHT)
                .nutritionInfo(NutritionInfo.builder().build())
                .usages(new HashSet<>())
                .createdAt(CREATED_AT)
                .updatedAt(UPDATED_AT)
                .build();

        foodRequestDTO = FoodRequestDTO.builder()
                .name(FOOD_NAME)
                .foodGroup(FOOD_GROUP)
                .servingWeightGrams(SERVING_WEIGHT)
                .build();

        foodResponseDTO = FoodResponseDTO.builder()
                .id(FOOD_ID)
                .name(FOOD_NAME)
                .foodGroup(FOOD_GROUP)
                .servingWeightGrams(SERVING_WEIGHT)
                .createdAt(CREATED_AT)
                .updatedAt(UPDATED_AT)
                .recipeCount(0)
                .build();
    }


    // --------------------------------------------------------

    @Test
    void findAll_ShouldReturnMappedList() {
        
        List<Food> foods = List.of(foodEntity);
        when(foodRepository.findAll()).thenReturn(foods);
        when(foodMapper.toResponseDTO(foodEntity)).thenReturn(foodResponseDTO);

        List<FoodResponseDTO> result = foodService.findAll();

        assertThat(result).containsExactly(foodResponseDTO);
        verify(foodRepository).findAll();
        verify(foodMapper).toResponseDTO(foodEntity);
    }

    @Test
    void findById_ExistingId_ShouldReturnDTO() {
        
        when(foodRepository.findById(FOOD_ID)).thenReturn(Optional.of(foodEntity));
        when(foodMapper.toResponseDTO(foodEntity)).thenReturn(foodResponseDTO);

        FoodResponseDTO result = foodService.findById(FOOD_ID);

        assertThat(result).isEqualTo(foodResponseDTO);
    }

    @Test
    void findById_NonExistingId_ShouldThrowException() {
        
        when(foodRepository.findById(FOOD_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> foodService.findById(FOOD_ID))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Food not found with id");
    }

    @Test
    void findByName_ExistingName_ShouldReturnDTO() {
        
        when(foodRepository.findByName(FOOD_NAME)).thenReturn(Optional.of(foodEntity));
        when(foodMapper.toResponseDTO(foodEntity)).thenReturn(foodResponseDTO);

        FoodResponseDTO result = foodService.findByName(FOOD_NAME);

        assertThat(result).isEqualTo(foodResponseDTO);
    }

    @Test
    void findByName_NonExistingName_ShouldThrowException() {
        
        when(foodRepository.findByName(FOOD_NAME)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> foodService.findByName(FOOD_NAME))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Food not found with name");
    }

    @Test
    void findByFoodGroup_ShouldReturnMappedList() {
        
        List<Food> foods = List.of(foodEntity);
        when(foodRepository.findByFoodGroup(FOOD_GROUP)).thenReturn(foods);
        when(foodMapper.toResponseDTO(foodEntity)).thenReturn(foodResponseDTO);

        List<FoodResponseDTO> result = foodService.findByFoodGroup(FOOD_GROUP);

        assertThat(result).containsExactly(foodResponseDTO);
        verify(foodRepository).findByFoodGroup(FOOD_GROUP);
        verify(foodMapper).toResponseDTO(foodEntity);
    }

    @Test
    void findByNameContaining_ShouldReturnMappedList() {
        
        List<Food> foods = List.of(foodEntity);
        when(foodRepository.findByNameContainingIgnoreCase("app")).thenReturn(foods);
        when(foodMapper.toResponseDTO(foodEntity)).thenReturn(foodResponseDTO);

        List<FoodResponseDTO> result = foodService.findByNameContaining("app");

        assertThat(result).containsExactly(foodResponseDTO);
        verify(foodRepository).findByNameContainingIgnoreCase("app");
        verify(foodMapper).toResponseDTO(foodEntity);
    }

    @Test
    void existsById_ShouldDelegateToRepository() {
        
        when(foodRepository.existsById(FOOD_ID)).thenReturn(true);

        assertThat(foodService.existsById(FOOD_ID)).isTrue();
        verify(foodRepository).existsById(FOOD_ID);
    }

    @Test
    void existsByName_ShouldDelegateToRepository() {
        
        when(foodRepository.existsByName(FOOD_NAME)).thenReturn(true);

        assertThat(foodService.existsByName(FOOD_NAME)).isTrue();
        verify(foodRepository).existsByName(FOOD_NAME);
    }

    @Test
    void create_ValidRequest_ShouldSaveAndReturnDTO() {
        
        when(foodRepository.existsByName(FOOD_NAME)).thenReturn(false);
        when(foodMapper.toEntity(foodRequestDTO)).thenReturn(foodEntity);
        when(foodRepository.save(foodEntity)).thenReturn(foodEntity);
        when(foodMapper.toResponseDTO(foodEntity)).thenReturn(foodResponseDTO);

        FoodResponseDTO result = foodService.create(foodRequestDTO);

        assertThat(result).isEqualTo(foodResponseDTO);
        verify(foodRepository).save(foodEntity);
    }

    @Test
    void create_ExistingFoodName_ShouldThrowException() {
        
        when(foodRepository.existsByName(FOOD_NAME)).thenReturn(true);

        assertThatThrownBy(() -> foodService.create(foodRequestDTO))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("already exists");
    }

    @Test
    void update_ExistingFood_ShouldUpdateAndReturnDTO() {
        
        String newName = "Banana";
        FoodRequestDTO updateDTO = FoodRequestDTO.builder()
                .name(newName)
                .foodGroup(FoodGroup.FRUIT)
                .servingWeightGrams(new BigDecimal("120"))
                .build();

        Food updatedFood = Food.builder()
                .id(FOOD_ID)
                .name(newName)
                .foodGroup(FoodGroup.FRUIT)
                .servingWeightGrams(new BigDecimal("120"))
                .nutritionInfo(NutritionInfo.builder().build())
                .usages(new HashSet<>())
                .createdAt(CREATED_AT)
                .updatedAt(UPDATED_AT)
                .build();

        FoodResponseDTO updatedResponse = FoodResponseDTO.builder()
                .id(FOOD_ID)
                .name(newName)
                .foodGroup(FoodGroup.FRUIT)
                .servingWeightGrams(new BigDecimal("120"))
                .createdAt(CREATED_AT)
                .updatedAt(UPDATED_AT)
                .recipeCount(0)
                .build();

        when(foodRepository.findById(FOOD_ID)).thenReturn(Optional.of(foodEntity));
        when(foodRepository.existsByName(newName)).thenReturn(false);
        when(foodMapper.toResponseDTO(updatedFood)).thenReturn(updatedResponse);
        when(foodRepository.save(any(Food.class))).thenReturn(updatedFood);

        FoodResponseDTO result = foodService.update(FOOD_ID, updateDTO);

        assertThat(result).isEqualTo(updatedResponse);
        verify(foodRepository).save(any(Food.class));
    }

    @Test
    void update_NonExistingFood_ShouldThrowException() {
        
        when(foodRepository.findById(FOOD_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> foodService.update(FOOD_ID, foodRequestDTO))
                .isInstanceOf(EntityNotFoundException.class);
    }

    @Test
    void delete_ExistingFoodWithoutUsages_ShouldDelete() {
        
        when(foodRepository.findById(FOOD_ID)).thenReturn(Optional.of(foodEntity));

        foodService.delete(FOOD_ID);

        verify(foodRepository).delete(foodEntity);
    }

    @Test
    void delete_FoodWithUsages_ShouldThrowResourceInUseException() {
        
        Set<Ingredient> usages = new HashSet<>();
        usages.add(mock(Ingredient.class));
        Food foodWithUsages = Food.builder()
                .id(FOOD_ID)
                .name(FOOD_NAME)
                .foodGroup(FOOD_GROUP)
                .servingWeightGrams(SERVING_WEIGHT)
                .nutritionInfo(NutritionInfo.builder().build())
                .usages(usages)
                .createdAt(CREATED_AT)
                .updatedAt(UPDATED_AT)
                .build();

        when(foodRepository.findById(FOOD_ID)).thenReturn(Optional.of(foodWithUsages));

        assertThatThrownBy(() -> foodService.delete(FOOD_ID))
                .isInstanceOf(ResourceInUseException.class)
                .hasMessageContaining("Food")
                .hasMessageContaining("Product");
    }
}
