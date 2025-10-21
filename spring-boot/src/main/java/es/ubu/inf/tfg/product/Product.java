package es.ubu.inf.tfg.product;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import es.ubu.inf.tfg.food.Food;
import es.ubu.inf.tfg.recipe.Recipe;
import es.ubu.inf.tfg.recipe.RecipeId;

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

    private LocalDateTime createdAt; 
    
    private LocalDateTime updatedAt;

    @Builder.Default
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Recipe> recipes = new HashSet<>();
    
    // --------------------------------------------------------

    public void addRecipe(Recipe recipe) {
        this.recipes.add(recipe);
        recipe.setProduct(this);
    }

    public void addRecipe(Recipe recipe, Double quantity) {
        recipe.setQuantity(quantity);
        this.recipes.add(recipe);
        recipe.setProduct(this);
    }

    public void addRecipeWithFood(Food food, Double quantity) {
        Recipe recipe = Recipe.builder()
            .id(new RecipeId(food.getId(), this.id))
            .quantity(quantity)
            .food(food)
            .product(this)
            .build();
        
        this.recipes.add(recipe);
        food.getRecipes().add(recipe); // También actualizamos el otro lado
    }

    public void removeRecipe(Recipe recipe) {
        this.recipes.remove(recipe);
        recipe.setProduct(null);
    }

    public void clearRecipes() {
        for (Recipe recipe : this.recipes) {
            recipe.setProduct(null);
        }
        this.recipes.clear();
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now().plusHours(2); 
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now().plusHours(2); ; 
    }
}
