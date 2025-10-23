package es.ubu.inf.tfg.recipe;

import es.ubu.inf.tfg.food.Food;
import es.ubu.inf.tfg.food.nutritionInfo.NutritionInfo;
import es.ubu.inf.tfg.product.Product;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Table(name = "recipes")
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
public class Recipe { // Representa la relación many-to-many entre Food y Product

    @EmbeddedId
    @EqualsAndHashCode.Include
    @ToString.Include
    private RecipeId id;
    
    @ToString.Include
    private Double quantity; // Cantidad del ingrediente (food) en el producto -> "gramosEscogidos" -> cambiar nombre??

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("foodId")
    @JoinColumn(name = "food_id")
    private Food food;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("productId")
    @JoinColumn(name = "product_id")
    private Product product;

    // --------------------------------------------------------

    @Builder
    public Recipe(RecipeId id, Double quantity, Food food, Product product) {
        this.id = id;
        this.quantity = quantity;
        this.setFood(food);
        this.setProduct(product);
    }

    // --------------------------------------------------------

    // En vez de guardar una copia de la info nutricional, llamamos al método para obtenerla según quantity
    public NutritionInfo calculateNutritionInfo(){
        return this.food.getNutritionInfoForQuantity(this.quantity);
    }

    public void setFood(Food food) {

        if (this.food != null) {
            this.food.getRecipes().remove(this);
        }
        this.food = food;
        
        // Actualizamos la relación inversa
        if (food != null && !food.getRecipes().contains(this)) {
            food.getRecipes().add(this);
        }
    }

    public void setProduct(Product product) {

        if (this.product != null) {
            this.product.getRecipes().remove(this);
        }
        this.product = product;
        
        // Actualizamos la relación inversa
        if (product != null && !product.getRecipes().contains(this)) {
            product.getRecipes().add(this);
        }
    }
}
