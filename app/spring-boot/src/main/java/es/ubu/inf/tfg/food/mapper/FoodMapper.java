package es.ubu.inf.tfg.food.mapper;

import es.ubu.inf.tfg.food.Food;
import es.ubu.inf.tfg.food.dto.FoodRequestDTO;
import es.ubu.inf.tfg.food.dto.FoodResponseDTO;
import es.ubu.inf.tfg.food.nutritionInfo.NutritionInfo;
import es.ubu.inf.tfg.food.nutritionInfo.dto.NutritionInfoDTO;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FoodMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "recipes", ignore = true)
    Food toEntity(FoodRequestDTO dto);

    @Mapping(target = "recipeCount", expression = "java(food.getRecipes().size())")
    FoodResponseDTO toResponseDTO(Food food);

    // --------------------------------------------------------

    @Mapping(target = "salt", ignore = true)
    @Mapping(target = "saturatedFats", ignore = true)
    @Mapping(target = "minerals", ignore = true)
    @Mapping(target = "vitamins", ignore = true)
    NutritionInfo toNutritionInfoEntity(NutritionInfoDTO dto);

    NutritionInfoDTO toNutritionInfoDTO(NutritionInfo entity);
}
