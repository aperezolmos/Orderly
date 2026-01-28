package es.ubu.inf.tfg.product;

import es.ubu.inf.tfg.food.classification.type.Allergen;
import es.ubu.inf.tfg.product.dto.ProductRequestDTO;
import es.ubu.inf.tfg.product.dto.ProductResponseDTO;
import es.ubu.inf.tfg.product.ingredient.dto.IngredientRequestDTO;
import es.ubu.inf.tfg.product.ingredient.dto.IngredientResponseDTO;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;


    @GetMapping
    @PreAuthorize("hasAuthority('PRODUCT_VIEW_LIST')")
    public ResponseEntity<List<ProductResponseDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> getProductById(
            @PathVariable Integer id,
            @RequestParam(required = false, defaultValue = "false") Boolean detailed,
            @RequestParam(required = false, defaultValue = "false") Boolean includeIngredients) {
        
        ProductResponseDTO product;
        if (detailed || includeIngredients) {
            product = productService.getProductDetailedInfo(id, includeIngredients);
        } else {
            product = productService.findById(id);
        }
        return ResponseEntity.ok(product);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductResponseDTO>> searchProducts( 
            @RequestParam(required = false) String name,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer foodId) {
        
        List<ProductResponseDTO> products;
        if (name != null) {
            products = productService.findByNameContaining(name);
        } else if (maxPrice != null) {
            products = productService.findByMaxPrice(maxPrice);
        } else if (foodId != null) {
            products = productService.findProductsByFood(foodId);
        } else {
            products = productService.findAll();
        }
        return ResponseEntity.ok(products);
    }

    @GetMapping("/filter-safe")
    @PreAuthorize("hasAuthority('PRODUCT_VIEW_LIST')")
    public ResponseEntity<List<ProductResponseDTO>> getSafeProducts(
            @RequestParam List<Allergen> exclude) {
        return ResponseEntity.ok(productService.findByExcludingAllergens(exclude));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('PRODUCT_CREATE')")
    public ResponseEntity<ProductResponseDTO> createProduct(@Valid @RequestBody ProductRequestDTO productRequest) {
        ProductResponseDTO createdProduct = productService.create(productRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('PRODUCT_EDIT')")
    public ResponseEntity<ProductResponseDTO> updateProduct(
            @PathVariable Integer id,
            @Valid @RequestBody ProductRequestDTO productRequest) {
        
        ProductResponseDTO updatedProduct = productService.update(id, productRequest);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('PRODUCT_DELETE')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/exists")
    public ResponseEntity<Boolean> checkProductExists(@PathVariable Integer id) {
        return ResponseEntity.ok(productService.existsById(id));
    }

    @GetMapping("/check-name")
    public ResponseEntity<Boolean> checkProductNameAvailability(@RequestParam String name) {
        return ResponseEntity.ok(!productService.existsByName(name));
    }

    @GetMapping("/food/{foodId}/exists")
    public ResponseEntity<Boolean> checkProductsExistByFoodId(@PathVariable Integer foodId) {
        return ResponseEntity.ok(productService.existsByFoodId(foodId));
    }


    // --------------------------------------------------------
    // INGREDIENT ENDPOINTS

    @PostMapping("/{productId}/ingredients")
    @PreAuthorize("hasAuthority('PRODUCT_EDIT') and hasAuthority('PRODUCT_EDIT_INGREDIENTS')")
    public ResponseEntity<IngredientResponseDTO> addIngredientToProduct(
            @PathVariable Integer productId,
            @Valid @RequestBody IngredientRequestDTO ingredientRequest) {
        
        IngredientResponseDTO ingredient = productService.addIngredientToProduct(productId,
            ingredientRequest.getFoodId(), ingredientRequest.getQuantityInGrams());
        return ResponseEntity.status(HttpStatus.CREATED).body(ingredient);
    }

    @PutMapping("/{productId}/ingredients/{foodId}")
    @PreAuthorize("hasAuthority('PRODUCT_EDIT') and hasAuthority('PRODUCT_EDIT_INGREDIENTS')")
    public ResponseEntity<IngredientResponseDTO> updateIngredientQuantity(
            @PathVariable Integer productId,
            @PathVariable Integer foodId,
            @RequestParam BigDecimal quantity) {
        
        IngredientResponseDTO ingredient = productService.updateIngredientQuantity(productId, foodId, quantity);
        return ResponseEntity.ok(ingredient);
    }

    @DeleteMapping("/{productId}/ingredients/{foodId}")
    @PreAuthorize("hasAuthority('PRODUCT_EDIT') and hasAuthority('PRODUCT_EDIT_INGREDIENTS')")
    public ResponseEntity<Void> removeIngredientFromProduct(
            @PathVariable Integer productId,
            @PathVariable Integer foodId) {
        
        productService.removeIngredientFromProduct(productId, foodId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{productId}/ingredients")
    public ResponseEntity<List<IngredientResponseDTO>> getProductIngredients(@PathVariable Integer productId) {
        return ResponseEntity.ok(productService.getProductIngredients(productId));
    }
}
