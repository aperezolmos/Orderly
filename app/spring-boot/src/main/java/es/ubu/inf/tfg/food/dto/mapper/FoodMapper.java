package es.ubu.inf.tfg.food.dto.mapper;

import es.ubu.inf.tfg.food.Food;
import es.ubu.inf.tfg.food.dto.FoodRequestDTO;
import es.ubu.inf.tfg.food.dto.FoodResponseDTO;
import es.ubu.inf.tfg.food.nutritionInfo.dto.mapper.NutritionInfoMapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {NutritionInfoMapper.class})
public abstract class FoodMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "usages", ignore = true)
    public abstract Food toEntity(FoodRequestDTO dto);


    @Mapping(target = "recipeCount", expression = "java(food.getUsages() != null ? food.getUsages().size() : 0)")
    public abstract FoodResponseDTO toResponseDTO(Food food);
}
