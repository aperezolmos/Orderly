package es.ubu.inf.tfg.food.nutritionInfo.dto.mapper;

import es.ubu.inf.tfg.food.nutritionInfo.NutritionInfo;
import es.ubu.inf.tfg.food.nutritionInfo.dto.NutritionInfoDTO;

import org.mapstruct.Mapper;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE,
        nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS)
public abstract class NutritionInfoMapper {

    public abstract NutritionInfo toEntity(NutritionInfoDTO dto);

    public abstract NutritionInfoDTO toDTO(NutritionInfo entity);
}
