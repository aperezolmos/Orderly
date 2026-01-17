package es.ubu.inf.tfg.food.external.openFoodFacts;

import es.ubu.inf.tfg.food.dto.FoodRequestDTO;
import es.ubu.inf.tfg.food.external.openFoodFacts.dto.OpenFoodFactsProductDTO;
import es.ubu.inf.tfg.food.external.openFoodFacts.dto.OpenFoodFactsResponseDTO;
import es.ubu.inf.tfg.food.external.openFoodFacts.dto.mapper.OpenFoodFactsMapper;
import es.ubu.inf.tfg.exception.OpenFoodFactsException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
@Slf4j
public class OpenFoodFactsService {

    private static final String USER_AGENT = "TFG-Restauracion/0.8.0-beta (apo1004@alu.ubu.es) (https://github.com/aperezolmos)";
    private static final String OFF_API_URL = 
        "https://world.openfoodfacts.org/api/v2/product/{barcode}" +
        "?fields=product_name,product_name_es,product_name_en,nutriments";

    private final RestTemplate restTemplate = new RestTemplate();

    private final OpenFoodFactsMapper openFoodFactsMapper;


    public OpenFoodFactsProductDTO fetchProductByBarcode(String barcode) {
        
        log.info("Intentando obtener producto de Open Food Facts para código de barras: {}", barcode);
        log.debug("URL de la API: {}, Código de barras: {}", OFF_API_URL, barcode);
        
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.USER_AGENT, USER_AGENT);
        HttpEntity<Void> entity = new HttpEntity<>(headers);
        
        log.debug("Headers configurados - User-Agent: {}", USER_AGENT);

        ResponseEntity<OpenFoodFactsResponseDTO> response;
        try {
            log.debug("Realizando petición GET a Open Food Facts API...");
            response = restTemplate.exchange(
                OFF_API_URL,
                HttpMethod.GET,
                entity,
                OpenFoodFactsResponseDTO.class,
                barcode
            );
            log.debug("Respuesta recibida - Status: {}, Headers: {}", 
                     response.getStatusCode(), response.getHeaders());
            
        } 
        catch (Exception ex) {
            log.error("Error al obtener producto de Open Food Facts para código de barras: {}. Error: {}", 
                     barcode, ex.getMessage(), ex);
            throw new OpenFoodFactsException("Error fetching product from Open Food Facts: " + ex.getMessage());
        }

        if (response.getStatusCode() != HttpStatus.OK || response.getBody() == null || response.getBody().getProduct() == null) {
            log.warn("Producto no encontrado en Open Food Facts para código de barras: {}. Status: {}", 
                    barcode, response.getStatusCode());
            throw new OpenFoodFactsException("Product not found in Open Food Facts for barcode: " + barcode);
        }

        log.info("Producto obtenido exitosamente de Open Food Facts para código de barras: {}", barcode);
        log.debug("Contenido de la respuesta: {}", response.getBody().getProduct());
        
        return response.getBody().getProduct();
    }
    

    public FoodRequestDTO createFoodFromOpenFoodFacts(String barcode) {

        OpenFoodFactsProductDTO offProduct = fetchProductByBarcode(barcode);
        return openFoodFactsMapper.toFoodRequestDTO(offProduct);
    }
}