package es.ubu.inf.tfg.reservation.diningTable;

import es.ubu.inf.tfg.exception.ResourceInUseException;
import es.ubu.inf.tfg.reservation.diningTable.dto.DiningTableRequestDTO;
import es.ubu.inf.tfg.reservation.diningTable.dto.DiningTableResponseDTO;
import es.ubu.inf.tfg.reservation.diningTable.dto.mapper.DiningTableMapper;

import jakarta.persistence.EntityNotFoundException;

import lombok.RequiredArgsConstructor;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class DiningTableService {

    private final DiningTableRepository diningTableRepository;
    private final DiningTableMapper diningTableMapper;

    
    public List<DiningTableResponseDTO> findAll() {
        return diningTableRepository.findAll().stream()
                .map(diningTableMapper::toResponseDTO)
                .toList();
    }

    public DiningTableResponseDTO findById(Integer id) {
        DiningTable table = findEntityById(id);
        return diningTableMapper.toResponseDTO(table);
    }

    public DiningTable findEntityById(Integer id) {
        return diningTableRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Table not found with id: " + id));
    }

    public DiningTableResponseDTO findByName(String name) {
        DiningTable table = diningTableRepository.findByName(name)
                .orElseThrow(() -> new EntityNotFoundException("Table not found with name: " + name));
        return diningTableMapper.toResponseDTO(table);
    }

    public DiningTable findActiveTableById(Integer id) {
        return diningTableRepository.findByIdAndIsActiveTrue(id)
                .orElseThrow(() -> new EntityNotFoundException("Table with id: " + id + " not found or not active"));
    }

    public List<DiningTableResponseDTO> findActiveTables() {
        return diningTableRepository.findByIsActiveTrue().stream()
                .map(diningTableMapper::toResponseDTO)
                .toList();
    }

    public List<DiningTableResponseDTO> findActiveTablesByCapacity(Integer minCapacity) {
        return diningTableRepository.findByIsActiveTrueAndCapacityGreaterThanEqual(minCapacity).stream()
                .map(diningTableMapper::toResponseDTO)
                .toList();
    }

    public boolean existsById(Integer id) {
        return diningTableRepository.existsById(id);
    }

    public boolean existsByName(String name) {
        return diningTableRepository.existsByName(name);
    }


    // --------------------------------------------------------
    // CRUD METHODS
    
    public DiningTableResponseDTO create(DiningTableRequestDTO tableRequest) {
        
        checkTableNameExists(tableRequest.getName());
        DiningTable table = diningTableMapper.toEntity(tableRequest);

        DiningTable savedTable = diningTableRepository.save(table);
        return diningTableMapper.toResponseDTO(savedTable);
    }

    public DiningTableResponseDTO update(Integer id, DiningTableRequestDTO tableRequest) {
        
        DiningTable existingTable = findEntityById(id);

        if (tableRequest.getName() != null && !tableRequest.getName().equals(existingTable.getName())) {
            checkTableNameExists(tableRequest.getName());
            existingTable.setName(tableRequest.getName());
        }

        if (tableRequest.getCapacity() != null && tableRequest.getCapacity() > 0) {
            existingTable.setCapacity(tableRequest.getCapacity());
        }
        existingTable.setLocationDescription(tableRequest.getLocationDescription());

        DiningTable updatedTable = diningTableRepository.save(existingTable);
        return diningTableMapper.toResponseDTO(updatedTable);
    }

    public void delete(Integer id) {
        
        DiningTable table = findEntityById(id);

        try {
            diningTableRepository.delete(table);
        }
        catch (DataIntegrityViolationException e) {
            throw new ResourceInUseException("DiningTable", id, "Reservation");
        }
    }


    // --------------------------------------------------------
    // STATUS MANAGEMENT
    
    public DiningTableResponseDTO activateTable(Integer id) {
        
        DiningTable table = findEntityById(id);
        table.setIsActive(true);
        
        DiningTable updatedTable = diningTableRepository.save(table);
        return diningTableMapper.toResponseDTO(updatedTable);
    }

    public DiningTableResponseDTO deactivateTable(Integer id) {
        
        DiningTable table = findEntityById(id);
        table.setIsActive(false);
        
        DiningTable updatedTable = diningTableRepository.save(table);
        return diningTableMapper.toResponseDTO(updatedTable);
    }


    // --------------------------------------------------------

    private void checkTableNameExists(String tableName) {
        if (existsByName(tableName)) {
            throw new IllegalArgumentException("Dining table with name: '" + tableName + "' already exists");
        }
    }
}
