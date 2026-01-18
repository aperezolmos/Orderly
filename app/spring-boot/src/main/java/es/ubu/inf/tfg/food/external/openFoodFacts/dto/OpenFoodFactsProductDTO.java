package es.ubu.inf.tfg.food.external.openFoodFacts.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class OpenFoodFactsProductDTO {
    
    @JsonProperty("product_name")
    private String productName;

    @JsonProperty("product_name_es")
    private String productNameEs;

    @JsonProperty("product_name_en")
    private String productNameEn;

    @JsonProperty("allergens_tags")
    private List<String> allergensTags;

    @JsonProperty("nutrition_grades")
    private String nutriScore;

    @JsonProperty("nova_group")
    private Integer novaGroup;

    @JsonProperty("nutriments")
    private Map<String, Object> nutriments;
}
