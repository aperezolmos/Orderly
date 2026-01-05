package es.ubu.inf.tfg.food.external.dto.mapper;

import es.ubu.inf.tfg.food.dto.FoodRequestDTO;
import es.ubu.inf.tfg.food.foodGroup.FoodGroup;
import es.ubu.inf.tfg.food.nutritionInfo.dto.MineralsDTO;
import es.ubu.inf.tfg.food.nutritionInfo.dto.NutritionInfoDTO;
import es.ubu.inf.tfg.food.nutritionInfo.dto.VitaminsDTO;
import es.ubu.inf.tfg.food.external.dto.OpenFoodFactsProductDTO;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Map;

@Component
public class OpenFoodFactsMapper {

    public FoodRequestDTO toFoodRequestDTO(OpenFoodFactsProductDTO offDto) {
        
        String name = extractName(offDto);
        if (name == null || name.isBlank()) {
            name = "Unnamed Food (" + System.currentTimeMillis() + ")";
        }


        Map<String, Object> nutriments = offDto.getNutriments();

        NutritionInfoDTO nutritionInfo = NutritionInfoDTO.builder()
            .calories(getBigDecimal(nutriments, "energy-kcal_100g"))
            .carbohydrates(getBigDecimal(nutriments, "carbohydrates_100g"))
            .fats(getBigDecimal(nutriments, "fat_100g"))
            .fiber(getBigDecimal(nutriments, "fiber_100g"))
            .protein(getBigDecimal(nutriments, "proteins_100g"))
            .salt(getBigDecimal(nutriments, "salt_100g"))
            .saturatedFats(getBigDecimal(nutriments, "saturated-fat_100g"))
            .sugars(getBigDecimal(nutriments, "sugars_100g"))
            .minerals(MineralsDTO.builder()
                .calcium(getBigDecimal(nutriments, "calcium_100g"))
                .iron(getBigDecimal(nutriments, "iron_100g"))
                .magnesium(getBigDecimal(nutriments, "magnesium_100g"))
                .phosphorus(getBigDecimal(nutriments, "phosphorus_100g"))
                .potassium(getBigDecimal(nutriments, "potassium_100g"))
                .selenium(getBigDecimal(nutriments, "selenium_100g"))
                .sodium(getBigDecimal(nutriments, "sodium_100g"))
                .zinc(getBigDecimal(nutriments, "zinc_100g"))
                .build())
            .vitamins(VitaminsDTO.builder()
                .vitaminA(getBigDecimal(nutriments, "vitamin-a_100g"))
                .vitaminB1(getBigDecimal(nutriments, "vitamin-b1_100g"))
                .vitaminB2(getBigDecimal(nutriments, "vitamin-b2_100g"))
                .vitaminB3(getBigDecimal(nutriments, "vitamin-pp_100g"))
                .vitaminB6(getBigDecimal(nutriments, "vitamin-b6_100g"))
                .vitaminB9(getBigDecimal(nutriments, "vitamin-b9_100g"))
                .vitaminB12(getBigDecimal(nutriments, "vitamin-b12_100g"))
                .vitaminC(getBigDecimal(nutriments, "vitamin-c_100g"))
                .vitaminD(getBigDecimal(nutriments, "vitamin-d_100g"))
                .vitaminE(getBigDecimal(nutriments, "vitamin-e_100g"))
                .build())
            .build();
        
        
        return FoodRequestDTO.builder()
            .name(name)
            .foodGroup(FoodGroup.NOT_APPLICABLE) //TODO: se deja así por el momento
            .servingWeightGrams(BigDecimal.valueOf(100)) //TODO: se deja así por el momento
            .nutritionInfo(nutritionInfo)
            .build();
    }


    // --------------------------------------------------------

    private String extractName(OpenFoodFactsProductDTO dto) {
        
        if (dto.getProductName() != null && !dto.getProductName().isBlank()) return dto.getProductName();
        if (dto.getProductNameEs() != null && !dto.getProductNameEs().isBlank()) return dto.getProductNameEs();
        if (dto.getProductNameEn() != null && !dto.getProductNameEn().isBlank()) return dto.getProductNameEn();
        return null;
    }

    private BigDecimal getBigDecimal(Map<String, Object> map, String key) {
        
        if (map == null || !map.containsKey(key) || map.get(key) == null) return null;
        try {
            Object value = map.get(key);
            if (value instanceof Number) {
                return new BigDecimal(((Number) value).toString());
            } 
            else if (value instanceof String str && !str.isBlank()) {
                return new BigDecimal(str);
            }
        } catch (Exception ignored) {}
        return null;
    }
}
