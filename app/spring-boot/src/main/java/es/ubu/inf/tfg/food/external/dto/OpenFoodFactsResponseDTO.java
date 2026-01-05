package es.ubu.inf.tfg.food.external.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class OpenFoodFactsResponseDTO {
    private OpenFoodFactsProductDTO product;
}
