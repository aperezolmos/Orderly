package es.ubu.inf.tfg.product;

import es.ubu.inf.tfg.food.nutritionInfo.NutritionInfo;
import es.ubu.inf.tfg.food.nutritionInfo.dto.NutritionInfoDTO;
import es.ubu.inf.tfg.food.nutritionInfo.dto.mapper.NutritionInfoMapper;
import es.ubu.inf.tfg.product.dto.ProductRequestDTO;
import es.ubu.inf.tfg.product.dto.ProductResponseDTO;
import es.ubu.inf.tfg.product.dto.mapper.ProductMapperImpl;
import es.ubu.inf.tfg.product.ingredient.Ingredient;
import es.ubu.inf.tfg.product.ingredient.dto.IngredientResponseDTO;
import es.ubu.inf.tfg.product.ingredient.dto.mapper.IngredientMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;

import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductMapperTest {

    @InjectMocks
    private ProductMapperImpl productMapper;

    @Mock
    private IngredientMapper ingredientMapper;
    @Mock
    private NutritionInfoMapper nutritionInfoMapper;


    private static final Integer PRODUCT_ID = 1;
    private static final String PRODUCT_NAME = "Pizza";
    private static final String PRODUCT_DESC = "Delicious pizza";
    private static final BigDecimal PRODUCT_PRICE = new BigDecimal("12.50");
    private static final LocalDateTime CREATED_AT = LocalDateTime.now().minusDays(1);
    private static final LocalDateTime UPDATED_AT = LocalDateTime.now();

    private Product productEntity;
    private ProductRequestDTO productRequestDTO;
    private NutritionInfo nutritionInfo;
    private NutritionInfoDTO nutritionInfoDTO;
    private Ingredient ingredient;
    private IngredientResponseDTO ingredientResponseDTO;


    @BeforeEach
    void setUp() {
        
        nutritionInfo = NutritionInfo.builder()
                .calories(new BigDecimal("300"))
                .protein(new BigDecimal("10"))
                .build();

        nutritionInfoDTO = NutritionInfoDTO.builder()
                .calories(new BigDecimal("300"))
                .protein(new BigDecimal("10"))
                .build();

        ingredient = Mockito.mock(Ingredient.class);
        ingredientResponseDTO = IngredientResponseDTO.builder()
                .foodId(2).foodName("Cheese")
                .quantityInGrams(new BigDecimal("50"))
                .build();

        productEntity = Product.builder()
                .id(PRODUCT_ID)
                .name(PRODUCT_NAME)
                .description(PRODUCT_DESC)
                .price(PRODUCT_PRICE)
                .ingredients(new HashSet<>(Set.of(ingredient)))
                .createdAt(CREATED_AT)
                .updatedAt(UPDATED_AT)
                .build();

        productRequestDTO = ProductRequestDTO.builder()
                .name(PRODUCT_NAME)
                .description(PRODUCT_DESC)
                .price(PRODUCT_PRICE)
                .build();
    }


    // --------------------------------------------------------

    @Test
    void toEntity_FromValidDTO_ShouldMapCorrectly() {
        
        Product entity = productMapper.toEntity(productRequestDTO);

        assertThat(entity.getId()).isNull();
        assertThat(entity.getName()).isEqualTo(PRODUCT_NAME);
        assertThat(entity.getDescription()).isEqualTo(PRODUCT_DESC);
        assertThat(entity.getPrice()).isEqualTo(PRODUCT_PRICE);
        assertThat(entity.getIngredients()).isEmpty();
        assertThat(entity.getCreatedAt()).isNull();
        assertThat(entity.getUpdatedAt()).isNull();
    }

    @Test
    void toResponseDTO_FromValidEntity_ShouldMapCorrectly() {

        ProductResponseDTO dto = productMapper.toResponseDTO(productEntity);

        assertThat(dto.getId()).isEqualTo(PRODUCT_ID);
        assertThat(dto.getName()).isEqualTo(PRODUCT_NAME);
        assertThat(dto.getDescription()).isEqualTo(PRODUCT_DESC);
        assertThat(dto.getPrice()).isEqualTo(PRODUCT_PRICE);
        assertThat(dto.getIngredientCount()).isEqualTo(1);
        assertThat(dto.getIngredients()).isNull();
    }

    @Test
    void toNutritionalResponseDTO_ShouldMapNutritionInfo() {
        
        when(nutritionInfoMapper.toDTO(nutritionInfo)).thenReturn(nutritionInfoDTO);

        ProductResponseDTO dto = productMapper.toNutritionalResponseDTO(productEntity, nutritionInfo);

        assertThat(dto.getTotalNutrition()).isEqualTo(nutritionInfoDTO);
        assertThat(dto.getIngredientCount()).isEqualTo(1);
        assertThat(dto.getIngredients()).isNull();
    }

    @Test
    void toCompleteResponseDTO_ShouldMapAllFields() {
        
        when(nutritionInfoMapper.toDTO(nutritionInfo)).thenReturn(nutritionInfoDTO);
        when(ingredientMapper.toResponseDTO(ingredient)).thenReturn(ingredientResponseDTO);

        ProductResponseDTO dto = productMapper.toCompleteResponseDTO(productEntity, nutritionInfo);

        assertThat(dto.getTotalNutrition()).isEqualTo(nutritionInfoDTO);
        assertThat(dto.getIngredientCount()).isEqualTo(1);
        assertThat(dto.getIngredients()).containsExactly(ingredientResponseDTO);
    }
}
