package es.ubu.inf.tfg.product.dto.mapper;

import es.ubu.inf.tfg.product.dto.IngredientResponseDTO;
import es.ubu.inf.tfg.product.ingredient.Ingredient;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface IngredientMapper {
    
    @Mapping(target = "foodId", source = "food.id")
    @Mapping(target = "foodName", source = "food.name")
    IngredientResponseDTO toResponseDTO(Ingredient ingredient);
}
