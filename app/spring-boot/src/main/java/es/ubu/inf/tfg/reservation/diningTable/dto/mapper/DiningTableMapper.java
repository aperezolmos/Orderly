package es.ubu.inf.tfg.reservation.diningTable.dto.mapper;

import es.ubu.inf.tfg.reservation.diningTable.DiningTable;
import es.ubu.inf.tfg.reservation.diningTable.dto.DiningTableRequestDTO;
import es.ubu.inf.tfg.reservation.diningTable.dto.DiningTableResponseDTO;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface DiningTableMapper {
    
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    DiningTable toEntity(DiningTableRequestDTO dto);

    
    DiningTableResponseDTO toResponseDTO(DiningTable entity);
}
