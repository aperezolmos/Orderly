package es.ubu.inf.tfg.product.mapper;

import es.ubu.inf.tfg.food.nutritionInfo.NutritionInfo;
import es.ubu.inf.tfg.food.nutritionInfo.dto.NutritionInfoDTO;
import es.ubu.inf.tfg.product.Product;
import es.ubu.inf.tfg.product.dto.ProductRequestDTO;
import es.ubu.inf.tfg.product.dto.ProductResponseDTO;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "recipes", ignore = true)
    Product toEntity(ProductRequestDTO dto);

    @Mapping(target = "ingredientCount", 
                expression = "java(product.getRecipes().size())")
    @Mapping(target = "totalNutrition", ignore = true)
    @Mapping(target = "totalCalories", ignore = true)
    ProductResponseDTO toResponseDTO(Product product);

    @Mapping(target = "ingredientCount",
                expression = "java(product.getRecipes().size())")
    @Mapping(target = "totalNutrition", source = "nutritionInfo")
    @Mapping(target = "totalCalories", source = "nutritionInfo.calories")
    ProductResponseDTO toDetailedResponseDTO(Product product, NutritionInfoDTO nutritionInfo);

    NutritionInfoDTO toNutritionInfoDTO(NutritionInfo nutritionInfo);
}
