package es.ubu.inf.tfg.init;

import es.ubu.inf.tfg.product.ProductRepository;
import es.ubu.inf.tfg.product.ProductService;
import es.ubu.inf.tfg.product.dto.ProductRequestDTO;
import es.ubu.inf.tfg.product.ingredient.dto.IngredientRequestDTO;
import es.ubu.inf.tfg.food.FoodService;
import es.ubu.inf.tfg.food.dto.FoodResponseDTO;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Component
@Order(4)
@RequiredArgsConstructor
@Slf4j
@ConditionalOnProperty(name = "APP_INIT_DEMO_DATA", havingValue = "true")
public class ProductDataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final ProductService productService;
    private final FoodService foodService;
    

    @Override
    public void run(String... args) {

        if (productRepository.count() > 0) {
            log.info("Product table already contains data. Skipping ProductDataInitializer");
            return;
        }

        FoodResponseDTO huevoDeGallina = getFood("Huevo de Gallina");
        FoodResponseDTO carneDeVacuno = getFood("Carne de Vacuno");
        FoodResponseDTO baconAhumado = getFood("Bacon Ahumado");
        FoodResponseDTO salmonNoruego = getFood("Salmón Noruego");
        FoodResponseDTO langostinos = getFood("Langostinos");
        FoodResponseDTO pechugaDePollo = getFood("Pechuga de Pollo");

        FoodResponseDTO lechugaIceberg = getFood("Lechuga Iceberg");
        FoodResponseDTO aguacate = getFood("Aguacate");
        FoodResponseDTO tomate = getFood("Tomate");
        FoodResponseDTO cebolla = getFood("Cebolla");
        FoodResponseDTO patatas = getFood("Patatas");

        FoodResponseDTO panBrioche = getFood("Pan Brioche");
        FoodResponseDTO spaghetti= getFood("Spaghetti");
        FoodResponseDTO harinaDeTrigo = getFood("Harina de Trigo");
        FoodResponseDTO arrozBlanco = getFood("Arroz Blanco");

        FoodResponseDTO nataParaCocinar = getFood("Nata para Cocinar");
        FoodResponseDTO quesoParmesano = getFood("Queso Parmesano");
        FoodResponseDTO quesoMozzarella = getFood("Queso Mozzarella");
        
        FoodResponseDTO salsaDeSoja = getFood("Salsa de Soja");
        FoodResponseDTO mayonesa = getFood("Mayonesa");
        FoodResponseDTO mostazaDijon = getFood("Mostaza Dijon");
        FoodResponseDTO aceiteDeOliva = getFood("Aceite de Oliva");

        FoodResponseDTO nuecesPeladas = getFood("Nueces Peladas");
        FoodResponseDTO chocolateNegro = getFood("Chocolate Negro");


        List<FoodResponseDTO> allFoods = List.of(
            huevoDeGallina, carneDeVacuno, baconAhumado, salmonNoruego, langostinos, pechugaDePollo,
            lechugaIceberg, aguacate, tomate, cebolla, patatas,
            panBrioche, spaghetti, harinaDeTrigo, arrozBlanco,
            nataParaCocinar, quesoParmesano, quesoMozzarella,
            salsaDeSoja, mayonesa, mostazaDijon, aceiteDeOliva,
            nuecesPeladas, chocolateNegro);

        if (allFoods.stream().anyMatch(Objects::isNull)) {
            log.warn("Some required foods are missing. Skipping ProductDataInitializer");
            return;
        }


        createProduct("Pizza Margarita", "Pizza clásica con tomate, mozzarella y aceite de oliva", 12.50, Set.of(
            ing(harinaDeTrigo, 120), ing(tomate, 80), ing(quesoMozzarella, 60), ing(aceiteDeOliva, 10)));

        createProduct("Classic Brioche Burger", "Hamburguesa de vacuno en pan brioche", 12.50, Set.of(
            ing(panBrioche, 80), ing(carneDeVacuno, 150), ing(mayonesa, 20), ing(lechugaIceberg, 15)));

        createProduct("Bacon & Egg Burger", "Hamburguesa con extra de bacon y huevo frito", 14.00, Set.of(
            ing(panBrioche, 80), ing(carneDeVacuno, 150), ing(baconAhumado, 30), ing(huevoDeGallina, 50)));

        createProduct("Spaghetti Carbonara", "Receta cremosa con nata, bacon y parmesano", 11.00, Set.of(
            ing(spaghetti, 100), ing(nataParaCocinar, 50), ing(baconAhumado, 30), ing(quesoParmesano, 15)));

        createProduct("Poke de Salmón", "Base de arroz con salmón marinado y aguacate", 15.00, Set.of(
            ing(arrozBlanco, 150), ing(salmonNoruego, 100), ing(aguacate, 60), ing(salsaDeSoja, 20)));

        createProduct("Ensalada César Premium", "Pollo, lechuga, parmesano y nueces", 10.50, Set.of(
            ing(lechugaIceberg, 100), ing(pechugaDePollo, 80), ing(quesoParmesano, 20), ing(nuecesPeladas, 15)));

        createProduct("Patatas Con Dos Salsas", "Patatas fritas con mezcla de mayo y mostaza", 6.50, Set.of(
            ing(patatas, 250), ing(mayonesa, 30), ing(mostazaDijon, 10)));

        createProduct("Tortilla con Cebolla", "Tortilla individual de patatas y cebolla", 5.50, Set.of(
            ing(huevoDeGallina, 100), ing(patatas, 150), ing(cebolla, 30)));

        createProduct("Salmón al Grill", "Lomo de salmón con guarnición de patatas", 18.00, Set.of(
            ing(salmonNoruego, 150), ing(patatas, 100), ing(aceiteDeOliva, 10)));

        createProduct("Pasta con Langostinos", "Spaghetti salteados con langostinos", 13.50, Set.of(
            ing(spaghetti, 100), ing(langostinos, 80), ing(aceiteDeOliva, 15)));

        createProduct("Sándwich de Pollo y Aguacate", "Pechuga a la plancha con aguacate", 9.50, Set.of(
            ing(pechugaDePollo, 120), ing(aguacate, 50), ing(mayonesa, 15)));

        createProduct("Pollo a la Crema de Mostaza", "Pechuga bañada en salsa de nata y mostaza", 13.00, Set.of(
            ing(pechugaDePollo, 180), ing(nataParaCocinar, 40), ing(mostazaDijon, 20)));

        createProduct("Wok de Langostinos", "Salteado rápido con cebolla y soja", 16.50, Set.of(
            ing(langostinos, 120), ing(cebolla, 50), ing(salsaDeSoja, 25)));

        createProduct("Brownie Artesano", "Postre casero de chocolate y nueces", 4.50, Set.of(
            ing(chocolateNegro, 50), ing(nuecesPeladas, 20), ing(huevoDeGallina, 25)));

        createProduct("Ensalada Nórdica", "Salmón ahumado, huevo y aguacate", 12.00, Set.of(
            ing(lechugaIceberg, 80), ing(salmonNoruego, 60), ing(huevoDeGallina, 50), ing(aguacate, 40)));

        createProduct("Snack Bowl", "Nueces y trozos de chocolate negro", 3.50, Set.of(
            ing(nuecesPeladas, 50), ing(chocolateNegro, 30)));

        log.info("Inserted 16 demo products with their ingredients");
    }


    // --------------------------------------------------------

    private void createProduct(String name, String desc, double price, Set<IngredientRequestDTO> ingredients) {
        ProductRequestDTO dto = ProductRequestDTO.builder()
            .name(name)
            .description(desc)
            .price(BigDecimal.valueOf(price))
            .ingredients(ingredients)
            .build();
        productService.create(dto);
    }

    private IngredientRequestDTO ing(FoodResponseDTO food, double qty) {
        if (food != null) {
        return IngredientRequestDTO.builder()
                    .foodId(food.getId())
                    .quantityInGrams(BigDecimal.valueOf(qty))
                    .build();
        }
        return null;
    }

    private FoodResponseDTO getFood(String name) {
        try {
            return foodService.findByName(name);
        } 
        catch (Exception e) {
            log.warn("Food not found: {}", name);
            return null;
        }
    }
}
