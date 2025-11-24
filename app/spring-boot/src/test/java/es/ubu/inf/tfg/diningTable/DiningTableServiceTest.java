package es.ubu.inf.tfg.diningTable;

import es.ubu.inf.tfg.exception.ResourceInUseException;
import es.ubu.inf.tfg.reservation.diningTable.DiningTable;
import es.ubu.inf.tfg.reservation.diningTable.DiningTableRepository;
import es.ubu.inf.tfg.reservation.diningTable.DiningTableService;
import es.ubu.inf.tfg.reservation.diningTable.dto.DiningTableRequestDTO;
import es.ubu.inf.tfg.reservation.diningTable.dto.DiningTableResponseDTO;
import es.ubu.inf.tfg.reservation.diningTable.dto.mapper.DiningTableMapper;

import jakarta.persistence.EntityNotFoundException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;

import java.time.LocalDateTime;
import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DiningTableServiceTest {

    @Mock
    private DiningTableRepository diningTableRepository;
    @Mock
    private DiningTableMapper diningTableMapper;

    @InjectMocks
    private DiningTableService diningTableService;

    private static final Integer TABLE_ID = 1;
    private static final String TABLE_NAME = "Table1";
    private static final Integer TABLE_CAPACITY = 4;
    private static final String LOCATION_DESC = "Next to window";
    private static final Boolean IS_ACTIVE = true;
    private static final LocalDateTime CREATED_AT = LocalDateTime.now().minusDays(1);
    private static final LocalDateTime UPDATED_AT = LocalDateTime.now();

    private DiningTable diningTable;
    private DiningTableRequestDTO requestDTO;
    private DiningTableResponseDTO responseDTO;


    @BeforeEach
    void setUp() {
        
        requestDTO = DiningTableRequestDTO.builder()
                .name(TABLE_NAME)
                .capacity(TABLE_CAPACITY)
                .locationDescription(LOCATION_DESC)
                .build();

        diningTable = DiningTable.builder()
                .id(TABLE_ID)
                .name(TABLE_NAME)
                .capacity(TABLE_CAPACITY)
                .locationDescription(LOCATION_DESC)
                .isActive(IS_ACTIVE)
                .createdAt(CREATED_AT)
                .updatedAt(UPDATED_AT)
                .build();

        responseDTO = DiningTableResponseDTO.builder()
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
    // FIND METHODS

    @Test
    void findAll_ShouldReturnMappedList() {
        
        List<DiningTable> tables = List.of(diningTable);
        when(diningTableRepository.findAll()).thenReturn(tables);
        when(diningTableMapper.toResponseDTO(diningTable)).thenReturn(responseDTO);

        List<DiningTableResponseDTO> result = diningTableService.findAll();

        assertThat(result).containsExactly(responseDTO);
        verify(diningTableRepository).findAll();
        verify(diningTableMapper).toResponseDTO(diningTable);
    }

    @Test
    void findById_ExistingId_ShouldReturnDTO() {
        
        when(diningTableRepository.findById(TABLE_ID)).thenReturn(Optional.of(diningTable));
        when(diningTableMapper.toResponseDTO(diningTable)).thenReturn(responseDTO);

        DiningTableResponseDTO result = diningTableService.findById(TABLE_ID);

        assertThat(result).isEqualTo(responseDTO);
        verify(diningTableRepository).findById(TABLE_ID);
        verify(diningTableMapper).toResponseDTO(diningTable);
    }

    @Test
    void findById_NonExistingId_ShouldThrowException() {
        
        when(diningTableRepository.findById(TABLE_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> diningTableService.findById(TABLE_ID))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Table not found with id");
    }

    @Test
    void findEntityById_ExistingId_ShouldReturnEntity() {
        
        when(diningTableRepository.findById(TABLE_ID)).thenReturn(Optional.of(diningTable));

        DiningTable result = diningTableService.findEntityById(TABLE_ID);

        assertThat(result).isEqualTo(diningTable);
    }

    @Test
    void findEntityById_NonExistingId_ShouldThrowException() {
        
        when(diningTableRepository.findById(TABLE_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> diningTableService.findEntityById(TABLE_ID))
                .isInstanceOf(EntityNotFoundException.class);
    }

    @Test
    void findByName_ExistingName_ShouldReturnDTO() {
        
        when(diningTableRepository.findByName(TABLE_NAME)).thenReturn(Optional.of(diningTable));
        when(diningTableMapper.toResponseDTO(diningTable)).thenReturn(responseDTO);

        DiningTableResponseDTO result = diningTableService.findByName(TABLE_NAME);

        assertThat(result).isEqualTo(responseDTO);
        verify(diningTableRepository).findByName(TABLE_NAME);
        verify(diningTableMapper).toResponseDTO(diningTable);
    }

    @Test
    void findByName_NonExistingName_ShouldThrowException() {
        
        when(diningTableRepository.findByName(TABLE_NAME)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> diningTableService.findByName(TABLE_NAME))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("Table not found with name");
    }

    @Test
    void findActiveTableById_ActiveTable_ShouldReturnEntity() {
        
        when(diningTableRepository.findByIdAndIsActiveTrue(TABLE_ID)).thenReturn(Optional.of(diningTable));

        DiningTable result = diningTableService.findActiveTableById(TABLE_ID);

        assertThat(result).isEqualTo(diningTable);
    }

    @Test
    void findActiveTableById_NonExistingOrInactive_ShouldThrowException() {
        
        when(diningTableRepository.findByIdAndIsActiveTrue(TABLE_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> diningTableService.findActiveTableById(TABLE_ID))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("not found or not active");
    }

    @Test
    void findActiveTables_ShouldReturnMappedList() {
        
        List<DiningTable> tables = List.of(diningTable);
        when(diningTableRepository.findByIsActiveTrue()).thenReturn(tables);
        when(diningTableMapper.toResponseDTO(diningTable)).thenReturn(responseDTO);

        List<DiningTableResponseDTO> result = diningTableService.findActiveTables();

        assertThat(result).containsExactly(responseDTO);
        verify(diningTableRepository).findByIsActiveTrue();
        verify(diningTableMapper).toResponseDTO(diningTable);
    }

    @Test
    void findActiveTablesByCapacity_ShouldReturnMappedList() {
        
        List<DiningTable> tables = List.of(diningTable);
        when(diningTableRepository.findByIsActiveTrueAndCapacityGreaterThanEqual(TABLE_CAPACITY)).thenReturn(tables);
        when(diningTableMapper.toResponseDTO(diningTable)).thenReturn(responseDTO);

        List<DiningTableResponseDTO> result = diningTableService.findActiveTablesByCapacity(TABLE_CAPACITY);

        assertThat(result).containsExactly(responseDTO);
        verify(diningTableRepository).findByIsActiveTrueAndCapacityGreaterThanEqual(TABLE_CAPACITY);
        verify(diningTableMapper).toResponseDTO(diningTable);
    }

    @Test
    void existsById_ShouldDelegateToRepository() {
        
        when(diningTableRepository.existsById(TABLE_ID)).thenReturn(true);

        assertThat(diningTableService.existsById(TABLE_ID)).isTrue();
        verify(diningTableRepository).existsById(TABLE_ID);
    }

    @Test
    void existsByName_ShouldDelegateToRepository() {
        
        when(diningTableRepository.existsByName(TABLE_NAME)).thenReturn(true);

        assertThat(diningTableService.existsByName(TABLE_NAME)).isTrue();
        verify(diningTableRepository).existsByName(TABLE_NAME);
    }


    // --------------------------------------------------------
    // CRUD METHODS

    @Test
    void create_ValidRequest_ShouldSaveAndReturnDTO() {
        
        when(diningTableRepository.existsByName(TABLE_NAME)).thenReturn(false);
        when(diningTableMapper.toEntity(requestDTO)).thenReturn(diningTable);
        when(diningTableRepository.save(diningTable)).thenReturn(diningTable);
        when(diningTableMapper.toResponseDTO(diningTable)).thenReturn(responseDTO);

        DiningTableResponseDTO result = diningTableService.create(requestDTO);

        assertThat(result).isEqualTo(responseDTO);
        verify(diningTableRepository).save(diningTable);
    }

    @Test
    void create_ExistingTableName_ShouldThrowException() {
        
        when(diningTableRepository.existsByName(TABLE_NAME)).thenReturn(true);

        assertThatThrownBy(() -> diningTableService.create(requestDTO))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("already exists");
    }

    @Test
    void update_ExistingTable_ShouldUpdateAndReturnDTO() {
        
        String newName = "Table2";
        String newLocation = "Next to TV";
        Integer newCapacity = 6;

        DiningTableRequestDTO updateDTO = DiningTableRequestDTO.builder()
                .name(newName)
                .capacity(newCapacity)
                .locationDescription(newLocation)
                .build();

        DiningTable updatedTable = DiningTable.builder()
                .id(TABLE_ID)
                .name(newName)
                .capacity(newCapacity)
                .locationDescription(newLocation)
                .isActive(IS_ACTIVE)
                .createdAt(CREATED_AT)
                .updatedAt(UPDATED_AT)
                .build();

        DiningTableResponseDTO updatedResponse = DiningTableResponseDTO.builder()
                .id(TABLE_ID)
                .name(newName)
                .capacity(newCapacity)
                .locationDescription(newLocation)
                .isActive(IS_ACTIVE)
                .createdAt(CREATED_AT)
                .updatedAt(UPDATED_AT)
                .build();

        when(diningTableRepository.findById(TABLE_ID)).thenReturn(Optional.of(diningTable));
        when(diningTableRepository.existsByName(newName)).thenReturn(false);
        when(diningTableRepository.save(any(DiningTable.class))).thenReturn(updatedTable);
        when(diningTableMapper.toResponseDTO(updatedTable)).thenReturn(updatedResponse);

        DiningTableResponseDTO result = diningTableService.update(TABLE_ID, updateDTO);

        assertThat(result).isEqualTo(updatedResponse);
        verify(diningTableRepository).save(any(DiningTable.class));
    }

    @Test
    void update_ChangeToExistingTableName_ShouldThrowException() {
        
        String existingName = "ExistingTable";
        DiningTableRequestDTO updateDTO = DiningTableRequestDTO.builder()
                .name(existingName)
                .capacity(TABLE_CAPACITY)
                .locationDescription(LOCATION_DESC)
                .build();

        when(diningTableRepository.findById(TABLE_ID)).thenReturn(Optional.of(diningTable));
        when(diningTableRepository.existsByName(existingName)).thenReturn(true);

        assertThatThrownBy(() -> diningTableService.update(TABLE_ID, updateDTO))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("already exists");
    }

    @Test
    void update_NonExistingTable_ShouldThrowException() {
        
        when(diningTableRepository.findById(TABLE_ID)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> diningTableService.update(TABLE_ID, requestDTO))
                .isInstanceOf(EntityNotFoundException.class);
    }

    @Test
    void delete_ExistingTable_ShouldDelete() {
        
        when(diningTableRepository.findById(TABLE_ID)).thenReturn(Optional.of(diningTable));

        diningTableService.delete(TABLE_ID);

        verify(diningTableRepository).delete(diningTable);
    }

    @Test
    void delete_TableInUse_ShouldThrowResourceInUseException() {
        
        when(diningTableRepository.findById(TABLE_ID)).thenReturn(Optional.of(diningTable));
        doThrow(new DataIntegrityViolationException("FK")).when(diningTableRepository).delete(diningTable);

        assertThatThrownBy(() -> diningTableService.delete(TABLE_ID))
                .isInstanceOf(ResourceInUseException.class)
                .hasMessageContaining("DiningTable")
                .hasMessageContaining("Reservation");
    }


    // --------------------------------------------------------
    // STATUS MANAGEMENT

    @Test
    void activateTable_ExistingTable_ShouldSetActiveAndReturnDTO() {
        
        DiningTable inactiveTable = DiningTable.builder()
                .id(TABLE_ID)
                .name(TABLE_NAME)
                .capacity(TABLE_CAPACITY)
                .locationDescription(LOCATION_DESC)
                .isActive(false)
                .createdAt(CREATED_AT)
                .updatedAt(UPDATED_AT)
                .build();

        DiningTable activatedTable = DiningTable.builder()
                .id(TABLE_ID)
                .name(TABLE_NAME)
                .capacity(TABLE_CAPACITY)
                .locationDescription(LOCATION_DESC)
                .isActive(true)
                .createdAt(CREATED_AT)
                .updatedAt(UPDATED_AT)
                .build();

        DiningTableResponseDTO activatedResponse = DiningTableResponseDTO.builder()
                .id(TABLE_ID)
                .name(TABLE_NAME)
                .capacity(TABLE_CAPACITY)
                .locationDescription(LOCATION_DESC)
                .isActive(true)
                .createdAt(CREATED_AT)
                .updatedAt(UPDATED_AT)
                .build();

        when(diningTableRepository.findById(TABLE_ID)).thenReturn(Optional.of(inactiveTable));
        when(diningTableRepository.save(inactiveTable)).thenReturn(activatedTable);
        when(diningTableMapper.toResponseDTO(activatedTable)).thenReturn(activatedResponse);

        DiningTableResponseDTO result = diningTableService.activateTable(TABLE_ID);

        assertThat(result).isEqualTo(activatedResponse);
        verify(diningTableRepository).save(inactiveTable);
    }

    @Test
    void deactivateTable_ExistingTable_ShouldSetInactiveAndReturnDTO() {
        
        DiningTable activeTable = DiningTable.builder()
                .id(TABLE_ID)
                .name(TABLE_NAME)
                .capacity(TABLE_CAPACITY)
                .locationDescription(LOCATION_DESC)
                .isActive(true)
                .createdAt(CREATED_AT)
                .updatedAt(UPDATED_AT)
                .build();

        DiningTable deactivatedTable = DiningTable.builder()
                .id(TABLE_ID)
                .name(TABLE_NAME)
                .capacity(TABLE_CAPACITY)
                .locationDescription(LOCATION_DESC)
                .isActive(false)
                .createdAt(CREATED_AT)
                .updatedAt(UPDATED_AT)
                .build();

        DiningTableResponseDTO deactivatedResponse = DiningTableResponseDTO.builder()
                .id(TABLE_ID)
                .name(TABLE_NAME)
                .capacity(TABLE_CAPACITY)
                .locationDescription(LOCATION_DESC)
                .isActive(false)
                .createdAt(CREATED_AT)
                .updatedAt(UPDATED_AT)
                .build();

        when(diningTableRepository.findById(TABLE_ID)).thenReturn(Optional.of(activeTable));
        when(diningTableRepository.save(activeTable)).thenReturn(deactivatedTable);
        when(diningTableMapper.toResponseDTO(deactivatedTable)).thenReturn(deactivatedResponse);

        DiningTableResponseDTO result = diningTableService.deactivateTable(TABLE_ID);

        assertThat(result).isEqualTo(deactivatedResponse);
        verify(diningTableRepository).save(activeTable);
    }
}
