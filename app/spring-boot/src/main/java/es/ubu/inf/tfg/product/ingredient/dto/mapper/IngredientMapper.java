package es.ubu.inf.tfg.product.ingredient.dto.mapper;

import es.ubu.inf.tfg.food.classification.dto.mapper.AllergenInfoMapper;
import es.ubu.inf.tfg.product.ingredient.Ingredient;
import es.ubu.inf.tfg.product.ingredient.dto.IngredientResponseDTO;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {AllergenInfoMapper.class})
public interface IngredientMapper {
    
    @Mapping(target = "foodId", source = "food.id")
    @Mapping(target = "foodName", source = "food.name")
    @Mapping(target = "allergenInfo", source = "food.allergenInfo")
    @Mapping(target = "nutritionalMetrics", source = "food.nutritionalMetrics")
    IngredientResponseDTO toResponseDTO(Ingredient ingredient);
}
