package es.ubu.inf.tfg.reservation.dto.mapper;

import java.time.LocalDateTime;

import es.ubu.inf.tfg.reservation.Reservation;
import es.ubu.inf.tfg.reservation.diningTable.DiningTable;
import es.ubu.inf.tfg.reservation.dto.ReservationRequestDTO;
import es.ubu.inf.tfg.reservation.dto.ReservationResponseDTO;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface ReservationMapper {
    
    // Request DTO to Entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "guestInfo.firstName", source = "guestFirstName")
    @Mapping(target = "guestInfo.lastName", source = "guestLastName")
    @Mapping(target = "guestInfo.phone", source = "guestPhone")
    @Mapping(target = "guestInfo.specialRequests", source = "guestSpecialRequests")
    @Mapping(target = "reservationDetails.numberOfGuests", source = "numberOfGuests")
    @Mapping(target = "reservationDetails.reservationDateTime", source = "reservationDateTime")
    @Mapping(target = "reservationDetails.estimatedDurationMinutes", source = "estimatedDurationMinutes")
    @Mapping(target = "diningTable", source = "diningTableId")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Reservation toEntity(ReservationRequestDTO dto);

    // Entity to Response DTO
    @Mapping(target = "guestFirstName", source = "guestInfo.firstName")
    @Mapping(target = "guestLastName", source = "guestInfo.lastName")
    @Mapping(target = "guestPhone", source = "guestInfo.phone")
    @Mapping(target = "guestSpecialRequests", source = "guestInfo.specialRequests")
    @Mapping(target = "numberOfGuests", source = "reservationDetails.numberOfGuests")
    @Mapping(target = "reservationDateTime", source = "reservationDetails.reservationDateTime")
    @Mapping(target = "estimatedDurationMinutes", source = "reservationDetails.estimatedDurationMinutes")
    @Mapping(target = "estimatedEndTime", source = "reservationDetails", qualifiedByName = "calculateEndTime")
    @Mapping(target = "diningTableId", source = "diningTable.id")
    @Mapping(target = "diningTableName", source = "diningTable.name")
    ReservationResponseDTO toResponseDTO(Reservation entity);

    // Update entity from DTO
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "diningTable", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "guestInfo.firstName", source = "guestFirstName")
    @Mapping(target = "guestInfo.lastName", source = "guestLastName")
    @Mapping(target = "guestInfo.phone", source = "guestPhone")
    @Mapping(target = "guestInfo.specialRequests", source = "guestSpecialRequests")
    @Mapping(target = "reservationDetails.numberOfGuests", source = "numberOfGuests")
    @Mapping(target = "reservationDetails.reservationDateTime", source = "reservationDateTime")
    @Mapping(target = "reservationDetails.estimatedDurationMinutes", source = "estimatedDurationMinutes")
    void updateEntityFromDTO(ReservationRequestDTO dto, @MappingTarget Reservation entity);


    // --------------------------------------------------------

    default DiningTable mapDiningTableId(Integer diningTableId) {
        if (diningTableId == null) {
            return null;
        }
        DiningTable diningTable = new DiningTable();
        diningTable.setId(diningTableId);
        return diningTable;
    }

    @Named("calculateEndTime")
    default LocalDateTime calculateEndTime(es.ubu.inf.tfg.reservation.details.ReservationDetails details) {
        return details != null ? details.calculateEstimatedEndTime() : null;
    }
}
