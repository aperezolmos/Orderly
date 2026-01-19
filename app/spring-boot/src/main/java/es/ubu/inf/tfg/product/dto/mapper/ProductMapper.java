package es.ubu.inf.tfg.product.dto.mapper;

import es.ubu.inf.tfg.food.classification.AllergenInfo;
import es.ubu.inf.tfg.food.classification.dto.mapper.AllergenInfoMapper;
import es.ubu.inf.tfg.food.nutritionInfo.NutritionInfo;
import es.ubu.inf.tfg.food.nutritionInfo.dto.mapper.NutritionInfoMapper;
import es.ubu.inf.tfg.product.Product;
import es.ubu.inf.tfg.product.dto.ProductRequestDTO;
import es.ubu.inf.tfg.product.dto.ProductResponseDTO;

import es.ubu.inf.tfg.product.ingredient.dto.mapper.IngredientMapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {IngredientMapper.class, AllergenInfoMapper.class, NutritionInfoMapper.class})
public abstract class ProductMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "ingredients", ignore = true)
    public abstract Product toEntity(ProductRequestDTO dto);

    
    @Mapping(target = "allergenInfo", ignore = true)
    @Mapping(target = "totalNutrition", ignore = true)
    @Mapping(target = "ingredientCount", expression = "java(product.getIngredients().size())")
    @Mapping(target = "ingredients", ignore = true)
    public abstract ProductResponseDTO toResponseDTO(Product product);

    
    @Mapping(target = "totalNutrition", source = "nutritionInfo")
    @Mapping(target = "ingredientCount", expression = "java(product.getIngredients().size())")
    @Mapping(target = "ingredients", ignore = true)
    public abstract ProductResponseDTO toNutritionalResponseDTO(Product product, AllergenInfo allergenInfo, NutritionInfo nutritionInfo);

    
    @Mapping(target = "totalNutrition", source = "nutritionInfo")
    @Mapping(target = "ingredientCount", expression = "java(product.getIngredients().size())")
    public abstract ProductResponseDTO toCompleteResponseDTO(Product product, AllergenInfo allergenInfo, NutritionInfo nutritionInfo);
}
