package es.ubu.inf.tfg.recipe.mapper;

import es.ubu.inf.tfg.recipe.Recipe;
import es.ubu.inf.tfg.recipe.dto.RecipeResponseDTO;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RecipeMapper {

    @Mapping(target = "foodId", source = "food.id")
    @Mapping(target = "foodName", source = "food.name")
    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "productName", source = "product.name")
    @Mapping(target = "nutritionInfo", expression = "java(recipe.calculateNutritionInfo())")
    RecipeResponseDTO toResponseDTO(Recipe recipe);
}
