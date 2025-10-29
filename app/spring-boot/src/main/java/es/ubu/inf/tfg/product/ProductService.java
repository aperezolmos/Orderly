package es.ubu.inf.tfg.product;

import java.util.List;

import org.springframework.stereotype.Service;

import es.ubu.inf.tfg.exception.ResourceInUseException;
import es.ubu.inf.tfg.food.nutritionInfo.NutritionInfo;
import es.ubu.inf.tfg.food.nutritionInfo.dto.NutritionInfoDTO;
import es.ubu.inf.tfg.product.dto.ProductRequestDTO;
import es.ubu.inf.tfg.product.dto.ProductResponseDTO;
import es.ubu.inf.tfg.product.mapper.ProductMapper;
import es.ubu.inf.tfg.recipe.Recipe;
import es.ubu.inf.tfg.recipe.RecipeService;
import es.ubu.inf.tfg.recipe.dto.RecipeResponseDTO;
import es.ubu.inf.tfg.recipe.mapper.RecipeMapper;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    private final RecipeService recipeService;
    private final ProductMapper productMapper;
    private final RecipeMapper recipeMapper;

    
    public List<ProductResponseDTO> findAll() {
        return productRepository.findAll().stream()
                .map(productMapper::toResponseDTO)
                .toList();
    }

    public ProductResponseDTO findById(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));
        return productMapper.toResponseDTO(product);
    }

    public Product findEntityById(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));
    }

    public ProductResponseDTO findByName(String name) {
        Product product = productRepository.findByName(name)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with name: " + name));
        return productMapper.toResponseDTO(product);
    }

    public List<ProductResponseDTO> findByNameContaining(String namePart) {
        return productRepository.findByNameContainingIgnoreCase(namePart).stream()
                .map(productMapper::toResponseDTO)
                .toList();
    }

    public List<ProductResponseDTO> findByMaxPrice(Double maxPrice) {
        return productRepository.findByPriceLessThanEqual(maxPrice).stream()
                .map(productMapper::toResponseDTO)
                .toList();
    }

    public List<ProductResponseDTO> findProductsByFood(Integer foodId) {
        return productRepository.findByRecipes_FoodId(foodId).stream()
                .map(productMapper::toResponseDTO)
                .toList();
    }

    public boolean existsById(Integer id) {
        return productRepository.existsById(id);
    }

    public boolean existsByName(String name) {
        return productRepository.existsByName(name);
    }

    public boolean existsByFoodId(Integer foodId) {
        return productRepository.existsByRecipes_FoodId(foodId);
    }

    // --------------------------------------------------------

    public ProductResponseDTO create(ProductRequestDTO productRequest) {
        
        if (existsByName(productRequest.getName())) {
            throw new IllegalArgumentException("Product with name '" + productRequest.getName() + "' already exists");
        }
        
        Product product = productMapper.toEntity(productRequest);
        Product savedProduct = productRepository.save(product);
        return productMapper.toResponseDTO(savedProduct);
    }

    public ProductResponseDTO update(Integer id, ProductRequestDTO productRequest) {
        
        Product existingProduct = findEntityById(id);
        
        if (productRequest.getName() != null && !productRequest.getName().equals(existingProduct.getName())) {
            if (existsByName(productRequest.getName())) {
                throw new IllegalArgumentException("Product with name '" + productRequest.getName() + "' already exists");
            }
            existingProduct.setName(productRequest.getName());
        }
        
        existingProduct.setDescription(productRequest.getDescription());
        
        if (productRequest.getPrice() >= 0) {
            existingProduct.setPrice(productRequest.getPrice());
        }
        
        Product updatedProduct = productRepository.save(existingProduct);
        return productMapper.toResponseDTO(updatedProduct);
    }

    public void delete(Integer id) {
        
        Product product = findEntityById(id);

        if (!product.getRecipes().isEmpty()) {
            throw new ResourceInUseException("Product", id, "Food");
        }
        productRepository.delete(product);
    }

    // --------------------------------------------------------

    public RecipeResponseDTO addFoodToProduct(Integer productId, Integer foodId, Double quantity) {
        Recipe recipe = recipeService.create(productId, foodId, quantity);
        return recipeMapper.toResponseDTO(recipe);
    }

    public RecipeResponseDTO updateFoodQuantityInProduct(Integer productId, Integer foodId, Double newQuantity) {
        Recipe recipe = recipeService.updateQuantity(productId, foodId, newQuantity);
        return recipeMapper.toResponseDTO(recipe);
    }

    public void removeFoodFromProduct(Integer productId, Integer foodId) {
        recipeService.delete(productId, foodId);
    }

    public NutritionInfoDTO calculateProductNutritionInfo(Integer productId) {
        
        Product product = findEntityById(productId);
        
        NutritionInfo totalNutrition = NutritionInfo.builder().build();
        
        for (Recipe recipe : product.getRecipes()) {
            NutritionInfo recipeNutrition = recipe.calculateNutritionInfo();
            totalNutrition = totalNutrition.add(recipeNutrition);
        }
        return productMapper.toNutritionInfoDTO(totalNutrition);
    }

    public ProductResponseDTO getProductDetailedInfo(Integer productId) {
        
        Product product = findEntityById(productId);
        
        NutritionInfoDTO nutritionInfo = calculateProductNutritionInfo(productId);
        
        return productMapper.toDetailedResponseDTO(product, nutritionInfo);
    }

    public List<RecipeResponseDTO> getProductIngredients(Integer productId) {
        
        Product product = findEntityById(productId);
        
        return product.getRecipes().stream()
                .map(recipeMapper::toResponseDTO)
                .toList();
    }
}
