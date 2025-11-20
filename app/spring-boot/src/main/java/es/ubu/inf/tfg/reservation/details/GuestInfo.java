package es.ubu.inf.tfg.reservation.details;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import lombok.*;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
@ToString(onlyExplicitlyIncluded = true)
@Builder
public class GuestInfo {
    
    @Column(nullable = false, length = 100)
    @ToString.Include
    private String firstName;
    
    @Column(nullable = false, length = 100)
    private String lastName;
    
    @Column(nullable = false, length = 20)
    @ToString.Include
    private String phone;
    
    @Column(length = 500)
    private String specialRequests; // Allergies, preferences, etc.
    
    
    // --------------------------------------------------------

    public String getFullName() {
        return firstName + " " + lastName;
    }
}
