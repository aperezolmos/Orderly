package es.ubu.inf.tfg.food.classification.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NutritionalMetricsDTO {
    
    @Pattern(regexp = "^[A-E]$")
    private String nutriScore;

    @Min(value = 1, message = "NOVA group cannot be lower than {value}")
    @Max(value = 4, message = "NOVA group cannot be higher than {value}")
    private Integer novaGroup;
}
