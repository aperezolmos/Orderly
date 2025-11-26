package es.ubu.inf.tfg.food;

import es.ubu.inf.tfg.food.dto.FoodRequestDTO;
import es.ubu.inf.tfg.food.dto.FoodResponseDTO;
import es.ubu.inf.tfg.food.dto.mapper.FoodMapperImpl;
import es.ubu.inf.tfg.food.foodGroup.FoodGroup;
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
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FoodMapperTest {

    @InjectMocks
    private FoodMapperImpl foodMapper;

    @Mock
    private NutritionInfoMapper nutritionInfoMapper;


    private static final Integer FOOD_ID = 1;
    private static final String FOOD_NAME = "Apple";
    private static final FoodGroup FOOD_GROUP = FoodGroup.FRUIT;
    private static final BigDecimal SERVING_WEIGHT = new BigDecimal("150");
    private static final LocalDateTime CREATED_AT = LocalDateTime.now().minusDays(1);
    private static final LocalDateTime UPDATED_AT = LocalDateTime.now();

    private FoodRequestDTO foodRequestDTO;
    private Food foodEntity;
    private NutritionInfo nutritionInfo;
    private NutritionInfoDTO nutritionInfoDTO;


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

        foodRequestDTO = FoodRequestDTO.builder()
                .name(FOOD_NAME)
                .foodGroup(FOOD_GROUP)
                .servingWeightGrams(SERVING_WEIGHT)
                .nutritionInfo(nutritionInfoDTO)
                .build();

        foodEntity = Food.builder()
                .id(FOOD_ID)
                .name(FOOD_NAME)
                .foodGroup(FOOD_GROUP)
                .servingWeightGrams(SERVING_WEIGHT)
                .nutritionInfo(nutritionInfo)
                .usages(Set.of())
                .createdAt(CREATED_AT)
                .updatedAt(UPDATED_AT)
                .build();
    }


    // --------------------------------------------------------

    @Test
    void toEntity_FromValidDTO_ShouldMapCorrectly() {
        
        when(nutritionInfoMapper.toEntity(nutritionInfoDTO)).thenReturn(nutritionInfo);

        Food entity = foodMapper.toEntity(foodRequestDTO);

        assertThat(entity.getId()).isNull();
        assertThat(entity.getName()).isEqualTo(FOOD_NAME);
        assertThat(entity.getFoodGroup()).isEqualTo(FOOD_GROUP);
        assertThat(entity.getServingWeightGrams()).isEqualTo(SERVING_WEIGHT);
        assertThat(entity.getNutritionInfo()).isEqualTo(nutritionInfo);
        assertThat(entity.getCreatedAt()).isNull();
        assertThat(entity.getUpdatedAt()).isNull();
    }

    @Test
    void toEntity_FromDTOWithNullNutritionInfo_ShouldMapCorrectly() {
        
        FoodRequestDTO dto = FoodRequestDTO.builder()
                .name(FOOD_NAME)
                .foodGroup(FOOD_GROUP)
                .servingWeightGrams(SERVING_WEIGHT)
                .nutritionInfo(null)
                .build();

        Food entity = foodMapper.toEntity(dto);

        assertThat(entity.getNutritionInfo()).isNull();
    }

    @Test
    void toResponseDTO_FromValidEntity_ShouldMapCorrectly() {
        
        when(nutritionInfoMapper.toDTO(nutritionInfo)).thenReturn(nutritionInfoDTO);

        FoodResponseDTO dto = foodMapper.toResponseDTO(foodEntity);

        assertThat(dto.getId()).isEqualTo(FOOD_ID);
        assertThat(dto.getName()).isEqualTo(FOOD_NAME);
        assertThat(dto.getFoodGroup()).isEqualTo(FOOD_GROUP);
        assertThat(dto.getServingWeightGrams()).isEqualTo(SERVING_WEIGHT);
        assertThat(dto.getNutritionInfo()).isEqualTo(nutritionInfoDTO);
        assertThat(dto.getCreatedAt()).isEqualTo(CREATED_AT);
        assertThat(dto.getUpdatedAt()).isEqualTo(UPDATED_AT);
        assertThat(dto.getRecipeCount()).isZero();
    }

    @Test
    void toResponseDTO_FromEntityWithNullNutritionInfo_ShouldMapCorrectly() {
        
        Food entity = Food.builder()
                .id(FOOD_ID)
                .name(FOOD_NAME)
                .foodGroup(FOOD_GROUP)
                .servingWeightGrams(SERVING_WEIGHT)
                .nutritionInfo(null)
                .usages(Set.of())
                .createdAt(CREATED_AT)
                .updatedAt(UPDATED_AT)
                .build();

        when(nutritionInfoMapper.toDTO(null)).thenReturn(null);

        FoodResponseDTO dto = foodMapper.toResponseDTO(entity);

        assertThat(dto.getNutritionInfo()).isNull();
    }

    @Test
    void updateEntityFromDTO_ShouldUpdateFields() {
        
        when(nutritionInfoMapper.toEntity(nutritionInfoDTO)).thenReturn(nutritionInfo);

        Food entity = Food.builder()
                .name("OldName")
                .foodGroup(FoodGroup.DAIRY)
                .servingWeightGrams(new BigDecimal("100"))
                .nutritionInfo(null)
                .build();

        foodMapper.updateEntityFromDTO(foodRequestDTO, entity);

        assertThat(entity.getName()).isEqualTo(FOOD_NAME);
        assertThat(entity.getFoodGroup()).isEqualTo(FOOD_GROUP);
        assertThat(entity.getServingWeightGrams()).isEqualTo(SERVING_WEIGHT);
        assertThat(entity.getNutritionInfo()).isEqualTo(nutritionInfo);
    }
}
