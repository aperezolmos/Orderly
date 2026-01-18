package es.ubu.inf.tfg.food.external.openFoodFacts.dto.mapper;

import es.ubu.inf.tfg.food.classification.FoodGroup;
import es.ubu.inf.tfg.food.classification.dto.AllergenInfoDTO;
import es.ubu.inf.tfg.food.classification.dto.NutritionalMetricsDTO;
import es.ubu.inf.tfg.food.classification.type.Allergen;
import es.ubu.inf.tfg.food.dto.FoodRequestDTO;
import es.ubu.inf.tfg.food.nutritionInfo.dto.MineralsDTO;
import es.ubu.inf.tfg.food.nutritionInfo.dto.NutritionInfoDTO;
import es.ubu.inf.tfg.food.nutritionInfo.dto.VitaminsDTO;
import es.ubu.inf.tfg.food.external.openFoodFacts.dto.OpenFoodFactsProductDTO;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Component
public class OpenFoodFactsMapper {

    public FoodRequestDTO toFoodRequestDTO(OpenFoodFactsProductDTO offDto) {
        
        String name = extractName(offDto);
        if (name == null || name.isBlank()) {
            name = "Unnamed Food (" + System.currentTimeMillis() + ")";
        }

        Map<String, Object> nutriments = offDto.getNutriments();

        NutritionInfoDTO nutritionInfo = NutritionInfoDTO.builder()
            .calories(getBigDecimal(nutriments, OpenFoodFactsRegistry.Nutriments.CALORIES))
            .carbohydrates(getBigDecimal(nutriments, OpenFoodFactsRegistry.Nutriments.CARBS))
            .fats(getBigDecimal(nutriments, OpenFoodFactsRegistry.Nutriments.FAT))
            .fiber(getBigDecimal(nutriments, OpenFoodFactsRegistry.Nutriments.FIBER))
            .protein(getBigDecimal(nutriments, OpenFoodFactsRegistry.Nutriments.PROTEIN))
            .salt(getBigDecimal(nutriments, OpenFoodFactsRegistry.Nutriments.SALT))
            .saturatedFats(getBigDecimal(nutriments, OpenFoodFactsRegistry.Nutriments.SATURATED_FAT))
            .sugars(getBigDecimal(nutriments, OpenFoodFactsRegistry.Nutriments.SUGARS))
            .minerals(mapMinerals(nutriments))
            .vitamins(mapVitamins(nutriments))
            .build();
        
        return FoodRequestDTO.builder()
            .name(name)
            .foodGroup(FoodGroup.COMBINATION) // TODO: se deja así de momento
            .servingWeightGrams(BigDecimal.valueOf(100))
            .allergenInfo(extractAllergenInfoDTO(offDto))
            .nutritionInfo(nutritionInfo)
            .nutritionalMetrics(extractNutritionalMetrics(offDto))
            .build();
    }


    // --------------------------------------------------------

    private MineralsDTO mapMinerals(Map<String, Object> n) {
        return MineralsDTO.builder()
            .calcium(getBigDecimal(n, OpenFoodFactsRegistry.Nutriments.CALCIUM))
            .iron(getBigDecimal(n, OpenFoodFactsRegistry.Nutriments.IRON))
            .magnesium(getBigDecimal(n, OpenFoodFactsRegistry.Nutriments.MAGNESIUM))
            .phosphorus(getBigDecimal(n, OpenFoodFactsRegistry.Nutriments.PHOSPHORUS))
            .potassium(getBigDecimal(n, OpenFoodFactsRegistry.Nutriments.POTASSIUM))
            .selenium(getBigDecimal(n, OpenFoodFactsRegistry.Nutriments.SELENIUM))
            .sodium(getBigDecimal(n, OpenFoodFactsRegistry.Nutriments.SODIUM))
            .zinc(getBigDecimal(n, OpenFoodFactsRegistry.Nutriments.ZINC))
            .build();
    }

    private VitaminsDTO mapVitamins(Map<String, Object> n) {
        return VitaminsDTO.builder()
            .vitaminA(getBigDecimal(n, OpenFoodFactsRegistry.Nutriments.VIT_A))
            .vitaminB1(getBigDecimal(n, OpenFoodFactsRegistry.Nutriments.VIT_B1))
            .vitaminB2(getBigDecimal(n, OpenFoodFactsRegistry.Nutriments.VIT_B2))
            .vitaminB3(getBigDecimal(n, OpenFoodFactsRegistry.Nutriments.VIT_B3))
            .vitaminB6(getBigDecimal(n, OpenFoodFactsRegistry.Nutriments.VIT_B6))
            .vitaminB9(getBigDecimal(n, OpenFoodFactsRegistry.Nutriments.VIT_B9))
            .vitaminB12(getBigDecimal(n, OpenFoodFactsRegistry.Nutriments.VIT_B12))
            .vitaminC(getBigDecimal(n, OpenFoodFactsRegistry.Nutriments.VIT_C))
            .vitaminD(getBigDecimal(n, OpenFoodFactsRegistry.Nutriments.VIT_D))
            .vitaminE(getBigDecimal(n, OpenFoodFactsRegistry.Nutriments.VIT_E))
            .build();
    }

    private String extractName(OpenFoodFactsProductDTO dto) {
        
        if (dto.getProductName() != null && !dto.getProductName().isBlank()) return dto.getProductName();
        if (dto.getProductNameEs() != null && !dto.getProductNameEs().isBlank()) return dto.getProductNameEs();
        if (dto.getProductNameEn() != null && !dto.getProductNameEn().isBlank()) return dto.getProductNameEn();
        return null;
    }

    private AllergenInfoDTO extractAllergenInfoDTO(OpenFoodFactsProductDTO dto) {
        
        Set<Allergen> allergens = (dto.getAllergensTags() != null) 
            ? mapAllergenTagsToAllergenSet(dto.getAllergensTags()) 
            : null;
        return AllergenInfoDTO.builder().allergens(allergens).build();
    }

    public Set<Allergen> mapAllergenTagsToAllergenSet(List<String> allergenTags) {
        
        if (allergenTags == null || allergenTags.isEmpty()) return null;
        
        Set<Allergen> result = new HashSet<>();
        for (String tag : allergenTags) {
            Allergen allergen = OpenFoodFactsRegistry.ALLERGEN_CODES.get(tag.trim());
            if (allergen != null) result.add(allergen);
        }
        return result.isEmpty() ? null : result;
    }

    private NutritionalMetricsDTO extractNutritionalMetrics(OpenFoodFactsProductDTO dto) {
        
        if (dto.getNutriScore() == null && dto.getNovaGroup() == null) return null;
        
        return NutritionalMetricsDTO.builder()
            .nutriScore(processNutriScore(dto.getNutriScore()))
            .novaGroup(processNovaGroup(dto.getNovaGroup()))
            .build();
    }

    private String processNutriScore(String nutriScore) {
        
        if (nutriScore == null || nutriScore.isBlank()) return null;

        String processed = nutriScore.trim().toUpperCase();
        if (processed.matches("^[A-E]$")) {
            return processed;
        }
        return null;
    }

    private Integer processNovaGroup(Integer novaGroup) {
        
        if (novaGroup == null) return null;
        
        if (novaGroup >= 1 && novaGroup <= 4) {
            return novaGroup;
        }
        return null;
    }

    private BigDecimal getBigDecimal(Map<String, Object> map, String key) {
        
        if (map == null || !map.containsKey(key) || map.get(key) == null) return null;
        try {
            Object value = map.get(key);
            if (value instanceof Number num) return new BigDecimal(num.toString());
            if (value instanceof String str && !str.isBlank()) return new BigDecimal(str);
        } 
        catch (Exception ignored) {}
        return null;
    }
}
