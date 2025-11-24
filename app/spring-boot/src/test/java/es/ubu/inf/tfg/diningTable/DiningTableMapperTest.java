package es.ubu.inf.tfg.diningTable;

import es.ubu.inf.tfg.reservation.diningTable.DiningTable;
import es.ubu.inf.tfg.reservation.diningTable.dto.DiningTableRequestDTO;
import es.ubu.inf.tfg.reservation.diningTable.dto.DiningTableResponseDTO;
import es.ubu.inf.tfg.reservation.diningTable.dto.mapper.DiningTableMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class DiningTableMapperTest {

    @Autowired
    private DiningTableMapper diningTableMapper;

    private static final Integer TABLE_ID = 1;
    private static final String TABLE_NAME = "Table1";
    private static final Integer TABLE_CAPACITY = 4;
    private static final String LOCATION_DESC = "Next to window";
    private static final Boolean IS_ACTIVE = true;
    private static final LocalDateTime CREATED_AT = LocalDateTime.now().minusDays(1);
    private static final LocalDateTime UPDATED_AT = LocalDateTime.now();

    private DiningTableRequestDTO tableRequestDTO;
    private DiningTable diningTableEntity;

    @BeforeEach
    void setUp() {
        
        tableRequestDTO = DiningTableRequestDTO.builder()
                .name(TABLE_NAME)
                .capacity(TABLE_CAPACITY)
                .locationDescription(LOCATION_DESC)
                .build();

        diningTableEntity = DiningTable.builder()
                .id(TABLE_ID)
                .name(TABLE_NAME)
                .capacity(TABLE_CAPACITY)
                .locationDescription(LOCATION_DESC)
                .isActive(IS_ACTIVE)
                .createdAt(CREATED_AT)
                .updatedAt(UPDATED_AT)
                .build();
    }


    // --------------------------------------------------------

    @Test
    void toEntity_FromValidDTO_ShouldMapCorrectly() {
        
        DiningTable entity = diningTableMapper.toEntity(tableRequestDTO);

        assertThat(entity).isNotNull();
        assertThat(entity.getId()).isNull();
        assertThat(entity.getName()).isEqualTo(TABLE_NAME);
        assertThat(entity.getCapacity()).isEqualTo(TABLE_CAPACITY);
        assertThat(entity.getLocationDescription()).isEqualTo(LOCATION_DESC);
        assertThat(entity.getIsActive()).isTrue();
        assertThat(entity.getCreatedAt()).isNull();
        assertThat(entity.getUpdatedAt()).isNull();
    }

    @Test
    void toEntity_FromDTOWithNullFields_ShouldMapCorrectly() {
        
        DiningTableRequestDTO dto = DiningTableRequestDTO.builder()
                .name(null)
                .capacity(null)
                .locationDescription(null)
                .build();

        DiningTable entity = diningTableMapper.toEntity(dto);

        assertThat(entity.getName()).isNull();
        assertThat(entity.getCapacity()).isNull();
        assertThat(entity.getLocationDescription()).isNull();
    }

    @Test
    void toEntity_FromNullDTO_ShouldReturnNull() {
        assertThat(diningTableMapper.toEntity(null)).isNull();
    }

    @Test
    void toResponseDTO_FromValidEntity_ShouldMapCorrectly() {
        
        DiningTableResponseDTO dto = diningTableMapper.toResponseDTO(diningTableEntity);

        assertThat(dto).isNotNull();
        assertThat(dto.getId()).isEqualTo(TABLE_ID);
        assertThat(dto.getName()).isEqualTo(TABLE_NAME);
        assertThat(dto.getCapacity()).isEqualTo(TABLE_CAPACITY);
        assertThat(dto.getLocationDescription()).isEqualTo(LOCATION_DESC);
        assertThat(dto.getIsActive()).isEqualTo(IS_ACTIVE);
        assertThat(dto.getCreatedAt()).isEqualTo(CREATED_AT);
        assertThat(dto.getUpdatedAt()).isEqualTo(UPDATED_AT);
    }

    @Test
    void toResponseDTO_FromEntityWithNullFields_ShouldMapCorrectly() {
        
        DiningTable entity = DiningTable.builder()
                .id(null)
                .name(null)
                .capacity(null)
                .locationDescription(null)
                .isActive(null)
                .createdAt(null)
                .updatedAt(null)
                .build();

        DiningTableResponseDTO dto = diningTableMapper.toResponseDTO(entity);

        assertThat(dto.getId()).isNull();
        assertThat(dto.getName()).isNull();
        assertThat(dto.getCapacity()).isNull();
        assertThat(dto.getLocationDescription()).isNull();
        assertThat(dto.getIsActive()).isNull();
        assertThat(dto.getCreatedAt()).isNull();
        assertThat(dto.getUpdatedAt()).isNull();
    }

    @Test
    void toResponseDTO_FromNullEntity_ShouldReturnNull() {
        assertThat(diningTableMapper.toResponseDTO(null)).isNull();
    }
}
