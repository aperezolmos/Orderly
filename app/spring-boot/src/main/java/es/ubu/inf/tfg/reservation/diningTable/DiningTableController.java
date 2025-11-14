package es.ubu.inf.tfg.reservation.diningTable;

import es.ubu.inf.tfg.reservation.diningTable.dto.DiningTableRequestDTO;
import es.ubu.inf.tfg.reservation.diningTable.dto.DiningTableResponseDTO;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tables")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class DiningTableController {

    private final DiningTableService diningTableService;


    @GetMapping
    @PreAuthorize("hasAuthority('TABLE_VIEW_LIST')")
    public ResponseEntity<List<DiningTableResponseDTO>> getAllTables() {
        return ResponseEntity.ok(diningTableService.findAll());
    }

    @GetMapping("/available")
    //@PreAuthorize("hasAuthority('TABLE_VIEW_LIST')") //TODO: ver si es necesario el permiso
    public ResponseEntity<List<DiningTableResponseDTO>> getAvailableTables(
            @RequestParam(required = false) Integer capacity) {
        
        List<DiningTableResponseDTO> tables;
        if (capacity != null) {
            tables = diningTableService.findAvailableTablesByCapacity(capacity);
        } else {
            tables = diningTableService.findAvailableTables();
        }
        return ResponseEntity.ok(tables);
    }

    @GetMapping("/active")
    @PreAuthorize("hasAuthority('TABLE_VIEW_LIST')")
    public ResponseEntity<List<DiningTableResponseDTO>> getActiveTables() {
        return ResponseEntity.ok(diningTableService.findActiveTables());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DiningTableResponseDTO> getTableById(@PathVariable Integer id) {
        return ResponseEntity.ok(diningTableService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('TABLE_CREATE')")
    public ResponseEntity<DiningTableResponseDTO> createTable(@Valid @RequestBody DiningTableRequestDTO tableRequest) {
        DiningTableResponseDTO createdTable = diningTableService.create(tableRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTable);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('TABLE_EDIT')")
    public ResponseEntity<DiningTableResponseDTO> updateTable(
            @PathVariable Integer id, 
            @Valid @RequestBody DiningTableRequestDTO tableRequest) {
        DiningTableResponseDTO updatedTable = diningTableService.update(id, tableRequest);
        return ResponseEntity.ok(updatedTable);
    }

    @PatchMapping("/{id}/activate")
    @PreAuthorize("hasAuthority('TABLE_EDIT')")
    public ResponseEntity<DiningTableResponseDTO> activateTable(@PathVariable Integer id) {
        DiningTableResponseDTO updatedTable = diningTableService.activateTable(id);
        return ResponseEntity.ok(updatedTable);
    }

    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasAuthority('TABLE_EDIT')")
    public ResponseEntity<DiningTableResponseDTO> deactivateTable(@PathVariable Integer id) {
        DiningTableResponseDTO updatedTable = diningTableService.deactivateTable(id);
        return ResponseEntity.ok(updatedTable);
    }

    @PatchMapping("/{id}/availability")
    @PreAuthorize("hasAuthority('TABLE_EDIT')")
    public ResponseEntity<DiningTableResponseDTO> setTableAvailability(
            @PathVariable Integer id,
            @RequestParam Boolean available) {
        
        DiningTableResponseDTO updatedTable = diningTableService.setTableAvailability(id, available);
        return ResponseEntity.ok(updatedTable);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('TABLE_DELETE')")
    public ResponseEntity<Void> deleteTable(@PathVariable Integer id) {
        diningTableService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/exists")
    public ResponseEntity<Boolean> checkTableExists(@PathVariable Integer id) {
        return ResponseEntity.ok(diningTableService.existsById(id));
    }

    @GetMapping("/name/{name}/exists")
    public ResponseEntity<Boolean> checkTableNameExists(@PathVariable String name) {
        return ResponseEntity.ok(diningTableService.existsByName(name));
    }
}
