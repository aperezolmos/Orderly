package es.ubu.inf.tfg.food.classification.dto.mapper;

import es.ubu.inf.tfg.food.classification.AllergenInfo;
import es.ubu.inf.tfg.food.classification.dto.AllergenInfoDTO;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class AllergenInfoMapper {

    public abstract AllergenInfo toEntity(AllergenInfoDTO dto);
    
    public abstract AllergenInfoDTO toDTO(AllergenInfo entity);
}
