package es.ubu.inf.tfg.product;

import es.ubu.inf.tfg.product.dto.ProductRequestDTO;
import es.ubu.inf.tfg.product.dto.ProductResponseDTO;
import es.ubu.inf.tfg.recipe.dto.RecipeResponseDTO;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    private final ProductService productService;


    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> getAllProducts() {
        return ResponseEntity.ok(productService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> getProductById(
            @PathVariable Integer id,
            @RequestParam(required = false, defaultValue = "false") Boolean detailed) {
        
        ProductResponseDTO product;
        if (detailed) {
            product = productService.getProductDetailedInfo(id);
        } else {
            product = productService.findById(id);
        }
        return ResponseEntity.ok(product);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductResponseDTO>> searchProducts( 
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Double maxPrice,
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

    @PostMapping
    public ResponseEntity<ProductResponseDTO> createProduct(@Valid @RequestBody ProductRequestDTO productRequest) {
        ProductResponseDTO createdProduct = productService.create(productRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> updateProduct(
            @PathVariable Integer id,
            @Valid @RequestBody ProductRequestDTO productRequest) {
        ProductResponseDTO updatedProduct = productService.update(id, productRequest);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/exists")
    public ResponseEntity<Boolean> checkProductExists(@PathVariable Integer id) {
        return ResponseEntity.ok(productService.existsById(id));
    }

    @GetMapping("/name/{name}/exists")
    public ResponseEntity<Boolean> checkProductNameExists(@PathVariable String name) {
        return ResponseEntity.ok(productService.existsByName(name));
    }

    @GetMapping("/food/{foodId}/exists")
    public ResponseEntity<Boolean> checkProductsExistByFoodId(@PathVariable Integer foodId) {
        return ResponseEntity.ok(productService.existsByFoodId(foodId));
    }

    // --------------------------------------------------------

    @PostMapping("/{productId}/foods/{foodId}")
    public ResponseEntity<RecipeResponseDTO> addFoodToProduct(
            @PathVariable Integer productId,
            @PathVariable Integer foodId,
            @RequestParam Double quantity) {
        RecipeResponseDTO recipe = productService.addFoodToProduct(productId, foodId, quantity);
        return ResponseEntity.status(HttpStatus.CREATED).body(recipe);
    }

    @PutMapping("/{productId}/foods/{foodId}")
    public ResponseEntity<RecipeResponseDTO> updateFoodQuantity(
            @PathVariable Integer productId,
            @PathVariable Integer foodId,
            @RequestParam Double quantity) {
        RecipeResponseDTO recipe = productService.updateFoodQuantityInProduct(productId, foodId, quantity);
        return ResponseEntity.ok(recipe);
    }

    @DeleteMapping("/{productId}/foods/{foodId}")
    public ResponseEntity<Void> removeFoodFromProduct(
            @PathVariable Integer productId,
            @PathVariable Integer foodId) {
        productService.removeFoodFromProduct(productId, foodId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{productId}/foods")
    public ResponseEntity<List<RecipeResponseDTO>> getProductIngredients(@PathVariable Integer productId) {
        return ResponseEntity.ok(productService.getProductIngredients(productId));
    }
}
