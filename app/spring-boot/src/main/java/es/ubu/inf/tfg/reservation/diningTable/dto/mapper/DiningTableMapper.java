package es.ubu.inf.tfg.reservation.diningTable.dto.mapper;

import es.ubu.inf.tfg.reservation.diningTable.DiningTable;
import es.ubu.inf.tfg.reservation.diningTable.dto.DiningTableRequestDTO;
import es.ubu.inf.tfg.reservation.diningTable.dto.DiningTableResponseDTO;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface DiningTableMapper {
    
    // Request DTO to Entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    DiningTable toEntity(DiningTableRequestDTO dto);

    // Entity to Response DTO
    DiningTableResponseDTO toResponseDTO(DiningTable entity);

    // Update entity from DTO
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateEntityFromDTO(DiningTableRequestDTO dto, @MappingTarget DiningTable entity);
}
