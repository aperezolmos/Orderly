package es.ubu.inf.tfg.food;

import es.ubu.inf.tfg.food.classification.AllergenInfo;
import es.ubu.inf.tfg.food.classification.FoodGroup;
import es.ubu.inf.tfg.food.classification.dto.AllergenInfoDTO;
import es.ubu.inf.tfg.food.classification.dto.mapper.AllergenInfoMapper;
import es.ubu.inf.tfg.food.classification.type.Allergen;
import es.ubu.inf.tfg.food.dto.FoodRequestDTO;
import es.ubu.inf.tfg.food.dto.FoodResponseDTO;
import es.ubu.inf.tfg.food.dto.mapper.FoodMapperImpl;
import es.ubu.inf.tfg.food.nutritionInfo.NutritionInfo;
import es.ubu.inf.tfg.food.nutritionInfo.dto.NutritionInfoDTO;
import es.ubu.inf.tfg.food.nutritionInfo.dto.mapper.NutritionInfoMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FoodMapperTest {

    @InjectMocks
    private FoodMapperImpl foodMapper;

    @Mock
    private AllergenInfoMapper allergenInfoMapper;
    @Mock
    private NutritionInfoMapper nutritionInfoMapper;


    private static final Integer FOOD_ID = 1;
    private static final String FOOD_NAME = "Apple";
    private static final FoodGroup FOOD_GROUP = FoodGroup.FRUIT;
    private static final BigDecimal SERVING_WEIGHT = new BigDecimal("150");
    private static final LocalDateTime CREATED_AT = LocalDateTime.now().minusDays(1);
    private static final LocalDateTime UPDATED_AT = LocalDateTime.now();

    private NutritionInfo nutritionInfo;
    private NutritionInfoDTO nutritionInfoDTO;
    private AllergenInfo allergenInfo;
    private AllergenInfoDTO allergenInfoDTO;
    

    @BeforeEach
    void setUp() {
        
        nutritionInfo = NutritionInfo.builder()
                .calories(new BigDecimal("52"))
                .protein(new BigDecimal("0.3"))
                .build();

        nutritionInfoDTO = NutritionInfoDTO.builder()
                .calories(new BigDecimal("52"))
                .protein(new BigDecimal("0.3"))
                .build();

        allergenInfo = AllergenInfo.builder().allergens(Set.of()).build();
        allergenInfoDTO = AllergenInfoDTO.builder().allergens(Set.of()).build();
    }


    // --------------------------------------------------------

    @Test
    void toEntity_FromValidDTO_ShouldMapCorrectly() {
        
        FoodRequestDTO foodRequestDTO = FoodRequestDTO.builder()
                .name(FOOD_NAME)
                .foodGroup(FOOD_GROUP)
                .servingWeightGrams(SERVING_WEIGHT)
                .nutritionInfo(nutritionInfoDTO)
                .allergenInfo(allergenInfoDTO)
                .build();

        when(nutritionInfoMapper.toEntity(nutritionInfoDTO)).thenReturn(nutritionInfo);
        when(allergenInfoMapper.toEntity(allergenInfoDTO)).thenReturn(allergenInfo);

        Food entity = foodMapper.toEntity(foodRequestDTO);

        assertThat(entity.getId()).isNull();
        assertThat(entity.getName()).isEqualTo(FOOD_NAME);
        assertThat(entity.getFoodGroup()).isEqualTo(FOOD_GROUP);
        assertThat(entity.getServingWeightGrams()).isEqualTo(SERVING_WEIGHT);
        assertThat(entity.getNutritionInfo()).isEqualTo(nutritionInfo);
        assertThat(entity.getAllergenInfo()).isEqualTo(allergenInfo);
        assertThat(entity.getCreatedAt()).isNull();
        assertThat(entity.getUpdatedAt()).isNull();
    }

    @Test
    void toEntity_FromDTOWithAllergens_ShouldMapCorrectly() {
        
        AllergenInfoDTO allergenWithValuesDTO = AllergenInfoDTO.builder()
                .allergens(Set.of(Allergen.GLUTEN, Allergen.MILK))
                .build();
        AllergenInfo allergenWithValues = AllergenInfo.builder()
                .allergens(Set.of(Allergen.GLUTEN, Allergen.MILK))
                .build();

        FoodRequestDTO foodRequestDTO = FoodRequestDTO.builder()
                .name(FOOD_NAME)
                .foodGroup(FOOD_GROUP)
                .servingWeightGrams(SERVING_WEIGHT)
                .nutritionInfo(nutritionInfoDTO)
                .allergenInfo(allergenWithValuesDTO)
                .build();

        when(nutritionInfoMapper.toEntity(nutritionInfoDTO)).thenReturn(nutritionInfo);
        when(allergenInfoMapper.toEntity(allergenWithValuesDTO)).thenReturn(allergenWithValues);

        Food entity = foodMapper.toEntity(foodRequestDTO);

        assertThat(entity.getAllergenInfo()).isEqualTo(allergenWithValues);
        assertThat(entity.getAllergenInfo().getAllergens()).containsExactlyInAnyOrder(Allergen.GLUTEN, Allergen.MILK);
    }

    @Test
    void toEntity_FromDTOWithNullNutritionInfo_ShouldMapCorrectly() {
        
        FoodRequestDTO foodRequestDTO = FoodRequestDTO.builder()
                .name(FOOD_NAME)
                .foodGroup(FOOD_GROUP)
                .servingWeightGrams(SERVING_WEIGHT)
                .nutritionInfo(null)
                .allergenInfo(allergenInfoDTO)
                .build();

        when(nutritionInfoMapper.toEntity(null)).thenReturn(null);
        when(allergenInfoMapper.toEntity(allergenInfoDTO)).thenReturn(allergenInfo);

        Food entity = foodMapper.toEntity(foodRequestDTO);

        assertThat(entity.getNutritionInfo()).isNull();
    }

    @Test
    void toEntity_FromDTOWithNullAllergenInfo_ShouldMapCorrectly() {
        
        FoodRequestDTO foodRequestDTO = FoodRequestDTO.builder()
                .name(FOOD_NAME)
                .foodGroup(FOOD_GROUP)
                .servingWeightGrams(SERVING_WEIGHT)
                .nutritionInfo(nutritionInfoDTO)
                .allergenInfo(null)
                .build();

        when(nutritionInfoMapper.toEntity(nutritionInfoDTO)).thenReturn(nutritionInfo);
        when(allergenInfoMapper.toEntity(null)).thenReturn(null);

        Food entity = foodMapper.toEntity(foodRequestDTO);

        assertThat(entity.getAllergenInfo()).isNull();
    }

    @Test
    void toResponseDTO_FromValidEntity_ShouldMapCorrectly() {
        
        Food foodEntity = Food.builder()
                .id(FOOD_ID)
                .name(FOOD_NAME)
                .foodGroup(FOOD_GROUP)
                .servingWeightGrams(SERVING_WEIGHT)
                .nutritionInfo(nutritionInfo)
                .allergenInfo(allergenInfo)
                .usages(Set.of())
                .createdAt(CREATED_AT)
                .updatedAt(UPDATED_AT)
                .build();

        when(nutritionInfoMapper.toDTO(nutritionInfo)).thenReturn(nutritionInfoDTO);
        when(allergenInfoMapper.toDTO(allergenInfo)).thenReturn(allergenInfoDTO);

        FoodResponseDTO dto = foodMapper.toResponseDTO(foodEntity);

        assertThat(dto.getId()).isEqualTo(FOOD_ID);
        assertThat(dto.getName()).isEqualTo(FOOD_NAME);
        assertThat(dto.getFoodGroup()).isEqualTo(FOOD_GROUP);
        assertThat(dto.getServingWeightGrams()).isEqualTo(SERVING_WEIGHT);
        assertThat(dto.getNutritionInfo()).isEqualTo(nutritionInfoDTO);
        assertThat(dto.getAllergenInfo()).isEqualTo(allergenInfoDTO);
        assertThat(dto.getCreatedAt()).isEqualTo(CREATED_AT);
        assertThat(dto.getUpdatedAt()).isEqualTo(UPDATED_AT);
        assertThat(dto.getRecipeCount()).isZero();
    }

    @Test
    void toResponseDTO_FromEntityWithAllergens_ShouldMapCorrectly() {
        
        AllergenInfo allergenWithValues = AllergenInfo.builder()
                .allergens(Set.of(Allergen.EGGS, Allergen.FISH))
                .build();
        AllergenInfoDTO allergenWithValuesDTO = AllergenInfoDTO.builder()
                .allergens(Set.of(Allergen.EGGS, Allergen.FISH))
                .build();

        Food foodEntity = Food.builder()
                .id(FOOD_ID)
                .name(FOOD_NAME)
                .foodGroup(FOOD_GROUP)
                .servingWeightGrams(SERVING_WEIGHT)
                .nutritionInfo(nutritionInfo)
                .allergenInfo(allergenWithValues)
                .usages(Set.of())
                .createdAt(CREATED_AT)
                .updatedAt(UPDATED_AT)
                .build();

        when(nutritionInfoMapper.toDTO(nutritionInfo)).thenReturn(nutritionInfoDTO);
        when(allergenInfoMapper.toDTO(allergenWithValues)).thenReturn(allergenWithValuesDTO);

        FoodResponseDTO dto = foodMapper.toResponseDTO(foodEntity);

        assertThat(dto.getAllergenInfo()).isEqualTo(allergenWithValuesDTO);
        assertThat(dto.getAllergenInfo().getAllergens()).containsExactlyInAnyOrder(Allergen.EGGS, Allergen.FISH);
    }

    @Test
    void toResponseDTO_FromEntityWithNullNutritionInfo_ShouldMapCorrectly() {
        
        Food foodEntity = Food.builder()
                .id(FOOD_ID)
                .name(FOOD_NAME)
                .foodGroup(FOOD_GROUP)
                .servingWeightGrams(SERVING_WEIGHT)
                .nutritionInfo(null)
                .allergenInfo(allergenInfo)
                .usages(Set.of())
                .createdAt(CREATED_AT)
                .updatedAt(UPDATED_AT)
                .build();

        when(nutritionInfoMapper.toDTO(null)).thenReturn(null);
        when(allergenInfoMapper.toDTO(allergenInfo)).thenReturn(allergenInfoDTO);

        FoodResponseDTO dto = foodMapper.toResponseDTO(foodEntity);

        assertThat(dto.getNutritionInfo()).isNull();
    }

    @Test
    void toResponseDTO_FromEntityWithNullAllergenInfo_ShouldMapCorrectly() {
        
        Food foodEntity = Food.builder()
                .id(FOOD_ID)
                .name(FOOD_NAME)
                .foodGroup(FOOD_GROUP)
                .servingWeightGrams(SERVING_WEIGHT)
                .nutritionInfo(nutritionInfo)
                .allergenInfo(null)
                .usages(Set.of())
                .createdAt(CREATED_AT)
                .updatedAt(UPDATED_AT)
                .build();

        when(nutritionInfoMapper.toDTO(nutritionInfo)).thenReturn(nutritionInfoDTO);
        when(allergenInfoMapper.toDTO(null)).thenReturn(null);

        FoodResponseDTO dto = foodMapper.toResponseDTO(foodEntity);

        assertThat(dto.getAllergenInfo()).isNull();
    }

    @Test
    void updateEntityFromDTO_ShouldUpdateFields() {
        
        FoodRequestDTO foodRequestDTO = FoodRequestDTO.builder()
                .name("Banana")
                .foodGroup(FoodGroup.FRUIT)
                .servingWeightGrams(new BigDecimal("120"))
                .nutritionInfo(nutritionInfoDTO)
                .allergenInfo(allergenInfoDTO)
                .build();

        Food entity = Food.builder()
                .name("OldName")
                .foodGroup(FoodGroup.DAIRY)
                .servingWeightGrams(new BigDecimal("100"))
                .nutritionInfo(null)
                .allergenInfo(null)
                .build();

        when(nutritionInfoMapper.toEntity(nutritionInfoDTO)).thenReturn(nutritionInfo);
        when(allergenInfoMapper.toEntity(allergenInfoDTO)).thenReturn(allergenInfo);

        foodMapper.updateEntityFromDTO(foodRequestDTO, entity);

        assertThat(entity.getName()).isEqualTo("Banana");
        assertThat(entity.getFoodGroup()).isEqualTo(FoodGroup.FRUIT);
        assertThat(entity.getServingWeightGrams()).isEqualTo(new BigDecimal("120"));
        assertThat(entity.getNutritionInfo()).isEqualTo(nutritionInfo);
        assertThat(entity.getAllergenInfo()).isEqualTo(allergenInfo);
    }

    @Test
    void updateEntityFromDTO_WithAllergens_ShouldUpdateAllergenInfo() {
        
        AllergenInfoDTO newAllergenDTO = AllergenInfoDTO.builder()
                .allergens(Set.of(Allergen.PEANUTS, Allergen.NUTS))
                .build();
        AllergenInfo newAllergen = AllergenInfo.builder()
                .allergens(Set.of(Allergen.PEANUTS, Allergen.NUTS))
                .build();

        FoodRequestDTO foodRequestDTO = FoodRequestDTO.builder()
                .name(FOOD_NAME)
                .foodGroup(FOOD_GROUP)
                .servingWeightGrams(SERVING_WEIGHT)
                .nutritionInfo(nutritionInfoDTO)
                .allergenInfo(newAllergenDTO)
                .build();

        Food entity = Food.builder()
                .name(FOOD_NAME)
                .foodGroup(FOOD_GROUP)
                .servingWeightGrams(SERVING_WEIGHT)
                .nutritionInfo(nutritionInfo)
                .allergenInfo(allergenInfo)
                .build();

        when(nutritionInfoMapper.toEntity(nutritionInfoDTO)).thenReturn(nutritionInfo);
        when(allergenInfoMapper.toEntity(newAllergenDTO)).thenReturn(newAllergen);

        foodMapper.updateEntityFromDTO(foodRequestDTO, entity);

        assertThat(entity.getAllergenInfo()).isEqualTo(newAllergen);
        assertThat(entity.getAllergenInfo().getAllergens()).containsExactlyInAnyOrder(Allergen.PEANUTS, Allergen.NUTS);
    }
}
