package es.ubu.inf.tfg.food.dto.mapper;

import es.ubu.inf.tfg.food.Food;
import es.ubu.inf.tfg.food.classification.dto.mapper.AllergenInfoMapper;
import es.ubu.inf.tfg.food.dto.FoodRequestDTO;
import es.ubu.inf.tfg.food.dto.FoodResponseDTO;
import es.ubu.inf.tfg.food.nutritionInfo.dto.mapper.NutritionInfoMapper;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", uses = {NutritionInfoMapper.class, AllergenInfoMapper.class})
public abstract class FoodMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "usages", ignore = true)
    public abstract Food toEntity(FoodRequestDTO dto);


    @Mapping(target = "recipeCount", expression = "java(food.getUsages() != null ? food.getUsages().size() : 0)")
    public abstract FoodResponseDTO toResponseDTO(Food food);


    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "usages", ignore = true)
    public abstract void updateEntityFromDTO(FoodRequestDTO dto, @MappingTarget Food entity);
}
