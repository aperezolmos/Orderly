package es.ubu.inf.tfg.food.nutritionInfo.dto.mapper;

import es.ubu.inf.tfg.food.nutritionInfo.NutritionInfo;
import es.ubu.inf.tfg.food.nutritionInfo.dto.NutritionInfoDTO;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class NutritionInfoMapper {

    public abstract NutritionInfo toEntity(NutritionInfoDTO dto);

    public abstract NutritionInfoDTO toDTO(NutritionInfo entity);
}
