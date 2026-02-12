package es.ubu.inf.tfg.food;

import es.ubu.inf.tfg.food.classification.FoodGroup;
import es.ubu.inf.tfg.food.dto.FoodRequestDTO;
import es.ubu.inf.tfg.food.dto.FoodResponseDTO;
import es.ubu.inf.tfg.food.external.openFoodFacts.OpenFoodFactsService;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/foods")
@RequiredArgsConstructor
public class FoodController {

    private final FoodService foodService;
    private final OpenFoodFactsService openFoodFactsService;
    

    @GetMapping
    @PreAuthorize("hasAuthority('FOOD_VIEW_LIST')")
    public ResponseEntity<List<FoodResponseDTO>> getAllFoods() {
        return ResponseEntity.ok(foodService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FoodResponseDTO> getFoodById(@PathVariable Integer id) {
        return ResponseEntity.ok(foodService.findById(id));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyAuthority('FOOD_VIEW_LIST', 'PRODUCT_CREATE', " +
                    "'PRODUCT_EDIT', 'PRODUCT_EDIT_INGREDIENTS')")
    public ResponseEntity<List<FoodResponseDTO>> searchFoods(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) FoodGroup foodGroup) {
        
        List<FoodResponseDTO> foods;
        if (name != null) {
            foods = foodService.findByNameContaining(name);
        } else if (foodGroup != null) {
            foods = foodService.findByFoodGroup(foodGroup);
        } else {
            foods = foodService.findAll();
        }
        return ResponseEntity.ok(foods);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('FOOD_CREATE')")
    public ResponseEntity<FoodResponseDTO> createFood(@Valid @RequestBody FoodRequestDTO foodRequest) {
        FoodResponseDTO createdFood = foodService.create(foodRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdFood);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('FOOD_EDIT')")
    public ResponseEntity<FoodResponseDTO> updateFood(
            @PathVariable Integer id, 
            @Valid @RequestBody FoodRequestDTO foodRequest) {
        FoodResponseDTO updatedFood = foodService.update(id, foodRequest);
        return ResponseEntity.ok(updatedFood);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('FOOD_DELETE')")
    public ResponseEntity<Void> deleteFood(@PathVariable Integer id) {
        foodService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/exists")
    public ResponseEntity<Boolean> checkFoodExists(@PathVariable Integer id) {
        return ResponseEntity.ok(foodService.existsById(id));
    }

    @GetMapping("/check-name")
    public ResponseEntity<Boolean> checkFoodNameAvailability(@RequestParam String name) {
        return ResponseEntity.ok(!foodService.existsByName(name));
    }


    // --------------------------------------------------------
    // ALLERGEN ENDPOINTS

    @GetMapping("/allergens")
    @PreAuthorize("hasAnyAuthority('FOOD_VIEW_LIST', 'FOOD_CREATE', 'FOOD_EDIT')")
    public ResponseEntity<List<String>> getAllAllergens() {
        return ResponseEntity.ok(foodService.getAllAllergens());
    }


    // --------------------------------------------------------
    // EXTERNAL FOOD API ENDPOINTS
    @GetMapping("/external/search")
    @PreAuthorize("hasAuthority('FOOD_CREATE')")
    public ResponseEntity<String> searchFoodFromExternalAPI(
            @RequestParam String query,
            @RequestParam(defaultValue = "1") int page) {
        
        String jsonResponse = openFoodFactsService.searchProducts(query, page);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .body(jsonResponse);
    }

    @PostMapping("/external/{barcode}")
    @PreAuthorize("hasAuthority('FOOD_CREATE')")
    public ResponseEntity<FoodResponseDTO> createFoodFromExternalAPI(@PathVariable String barcode) {
        
        FoodRequestDTO foodRequest = openFoodFactsService.createFoodFromOpenFoodFacts(barcode);
        FoodResponseDTO createdFood = foodService.create(foodRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdFood);
    }
}
