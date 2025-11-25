package es.ubu.inf.tfg.food.nutritionInfo.dto.mapper;

import es.ubu.inf.tfg.food.nutritionInfo.NutritionInfo;
import es.ubu.inf.tfg.food.nutritionInfo.dto.NutritionInfoDTO;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public abstract class NutritionInfoMapper {

    @Mapping(target = "add", ignore = true)
    @Mapping(target = "multiplyByFactor", ignore = true)
    @Mapping(target = "minerals.add", ignore = true)
    @Mapping(target = "minerals.multiplyByFactor", ignore = true)
    @Mapping(target = "vitamins.add", ignore = true)
    @Mapping(target = "vitamins.multiplyByFactor", ignore = true)
    public abstract NutritionInfo toEntity(NutritionInfoDTO dto);


    public abstract NutritionInfoDTO toDTO(NutritionInfo entity);
}
