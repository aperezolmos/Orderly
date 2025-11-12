package es.ubu.inf.tfg.product.ingredient;

import es.ubu.inf.tfg.food.Food;
import es.ubu.inf.tfg.food.nutritionInfo.NutritionInfo;
import es.ubu.inf.tfg.product.Product;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Table(name = "ingredients")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
public class Ingredient {

    @EmbeddedId
    @EqualsAndHashCode.Include
    @ToString.Include
    private IngredientId id;
    
    @ToString.Include
    private Double quantityInGrams;


    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("foodId")
    @JoinColumn(name = "food_id")
    private Food food;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("productId")
    @JoinColumn(name = "product_id")
    private Product product;

    // --------------------------------------------------------

    public Ingredient(Food food, Product product, Double quantityInGrams) {
        this.id = new IngredientId(food.getId(), product.getId());
        setQuantity(quantityInGrams);
        setFood(food);
        setProduct(product);
    }

    // --------------------------------------------------------

    public void setQuantity(Double newQuantity) {
        if (newQuantity != null && newQuantity > 0) {
            this.quantityInGrams = newQuantity;
        }
    }

    public void setFood(Food food) {
        if (this.food != null) {
            this.food.getUsages().remove(this);
        }
        this.food = food;
        if (food != null && !food.getUsages().contains(this)) {
            food.getUsages().add(this);
        }
    }

    public void setProduct(Product product) {
        if (this.product != null) {
            this.product.getIngredients().remove(this);
        }
        this.product = product;
        if (product != null && !product.getIngredients().contains(this)) {
            product.getIngredients().add(this);
        }
    }

    public void remove() {
        if (this.food != null) {
            this.food.getUsages().remove(this);
            this.food = null;
        }
        if (this.product != null) {
            this.product.getIngredients().remove(this);
            this.product = null;
        }
    }

    public NutritionInfo calculateNutritionInfo() {
        return this.food.getNutritionInfoForQuantity(this.quantityInGrams);
    }
}
