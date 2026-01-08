package es.ubu.inf.tfg.food.external.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

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

    @JsonProperty("nutriments")
    private Map<String, Object> nutriments;
}
