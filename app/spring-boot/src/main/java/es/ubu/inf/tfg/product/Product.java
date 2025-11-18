package es.ubu.inf.tfg.product;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import es.ubu.inf.tfg.food.Food;
import es.ubu.inf.tfg.food.nutritionInfo.NutritionInfo;
import es.ubu.inf.tfg.product.ingredient.Ingredient;
import es.ubu.inf.tfg.product.ingredient.IngredientId;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
@Builder
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    @ToString.Include
    private Integer id;

    @Column(nullable = false, unique = true)
    @ToString.Include
    private String name;

    private String description;

    private Double price; // TODO: precio fijo? o precio por unidad/por peso?


    @Builder.Default
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Ingredient> ingredients = new HashSet<>();
    

    private LocalDateTime createdAt; 
    
    private LocalDateTime updatedAt;
    
    
    // --------------------------------------------------------

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now().plusHours(2); 
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now().plusHours(2); ; 
    }


    // --------------------------------------------------------

    public Ingredient addIngredient(Food food, Double quantity) {
        
        validateFoodNotNull(food);
        validateQuantityPositive(quantity);
        
        if (findIngredientById(new IngredientId(food.getId(), this.id)).isPresent()) {
            throw new IllegalArgumentException("Ingredient with foodId: " + food.getId()
            + " already exists in product");
        }
        
        Ingredient ingredient = new Ingredient(food, this, quantity);
        return ingredient;
    }
    
    public void updateIngredientQuantity(Integer foodId, Double newQuantity) {

        validateQuantityPositive(newQuantity);
        
        Ingredient ingredient = findIngredientById(new IngredientId(foodId, this.id))
                .orElseThrow(() -> new IllegalArgumentException("Ingredient not found for foodId: " + foodId
                + " and productId: " + this.id));
        
        ingredient.setQuantity(newQuantity);
    }
    
    public void removeIngredient(Integer foodId) {
        
        Ingredient ingredient = findIngredientById(new IngredientId(foodId, this.id))
                .orElseThrow(() -> new IllegalArgumentException("Ingredient not found for foodId: " + foodId
                + " and productId: " + this.id));
        
        ingredient.remove();
    }
    
    public NutritionInfo calculateTotalNutrition() {
        
        NutritionInfo total = NutritionInfo.builder().build();
        for (Ingredient ingredient : ingredients) {
            NutritionInfo ingredientNutrition = ingredient.calculateNutritionInfo();
            total = total.add(ingredientNutrition);
        }
        return total;
    }


    // --------------------------------------------------------

    private Optional<Ingredient> findIngredientById(IngredientId ingredientId) {
        return ingredients.stream()
                .filter(ingredient -> ingredient.getId().equals(ingredientId))
                .findFirst();
    }
    
    private void validateFoodNotNull(Food food) {
        if (food == null) {
            throw new IllegalArgumentException("Food cannot be null");
        }
    }

    private void validateQuantityPositive(Double quantity){
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }
    }
}
