package es.ubu.inf.tfg.recipe;

import es.ubu.inf.tfg.food.Food;
import es.ubu.inf.tfg.product.Product;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "recipes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recipe { // Representa la relación many-to-many entre Food y Product

    @EmbeddedId
    private RecipeId id;
    
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
