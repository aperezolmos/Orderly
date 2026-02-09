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

    private static final String USER_AGENT = "Orderly/1.0.0 (apo1004@alu.ubu.es) (https://github.com/aperezolmos/Orderly)";

    private static final String OFF_SEARCH_URL = 
        "https://world.openfoodfacts.org/cgi/search.pl?search_terms={query}&search_simple=1&action=process&json=1&fields=" +
        "code,product_name,brands,image_url" + 
        "&page_size=20&page={page}";

    private static final String OFF_DETAILS_URL = 
        "https://world.openfoodfacts.org/api/v2/product/{barcode}?fields=" +
        "product_name," +
        "product_name_es," +
        "product_name_en," +
        "allergens_tags," + 
        "nutrition_grades," + 
        "nova_group," + 
        "nutriments";

    private final RestTemplate restTemplate = new RestTemplate();
    private final OpenFoodFactsMapper openFoodFactsMapper;


    public String searchProducts(String query, int page) {
        
        log.info("Searching on Open Food Facts: {} - Page: {}", query, page);

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.USER_AGENT, USER_AGENT);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                OFF_SEARCH_URL,
                HttpMethod.GET,
                entity,
                String.class,
                query,
                page
            );
            return response.getBody();
        } 
        catch (Exception ex) {
            log.error("Error in Open Food Facts search: {}", ex.getMessage());
            throw new OpenFoodFactsException("Error in external search");
        }
    }

    public OpenFoodFactsProductDTO fetchProductByBarcode(String barcode) {
        
        log.info("Trying to get product from Open Food Facts for barcode: {}", barcode);
        
        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.USER_AGENT, USER_AGENT);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<OpenFoodFactsResponseDTO> response;
        try {
            response = restTemplate.exchange(
                OFF_DETAILS_URL,
                HttpMethod.GET,
                entity,
                OpenFoodFactsResponseDTO.class,
                barcode
            );
            log.debug("Response received - Status: {}, Headers: {}", 
                     response.getStatusCode(), response.getHeaders());
            
        } 
        catch (Exception ex) {
            log.error("Error retrieving product from Open Food Facts for barcode: {}. Error: {}", 
                     barcode, ex.getMessage(), ex);
            throw new OpenFoodFactsException("Error fetching product from Open Food Facts: " + ex.getMessage());
        }

        if (response.getStatusCode() != HttpStatus.OK || response.getBody() == null || response.getBody().getProduct() == null) {
            log.warn("Product not found in Open Food Facts for barcode: {}. Status: {}", 
                    barcode, response.getStatusCode());
            throw new OpenFoodFactsException("Product not found in Open Food Facts for barcode: " + barcode);
        }

        log.info("Product successfully obtained from Open Food Facts for barcode: {}", barcode);
        log.debug("Content of the response: {}", response.getBody().getProduct());
        
        return response.getBody().getProduct();
    }
    

    public FoodRequestDTO createFoodFromOpenFoodFacts(String barcode) {

        OpenFoodFactsProductDTO offProduct = fetchProductByBarcode(barcode);
        return openFoodFactsMapper.toFoodRequestDTO(offProduct);
    }
}