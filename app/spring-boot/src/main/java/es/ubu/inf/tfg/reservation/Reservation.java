package es.ubu.inf.tfg.reservation;

import java.time.LocalDateTime;

import es.ubu.inf.tfg.reservation.details.GuestInfo;
import es.ubu.inf.tfg.reservation.details.ReservationDetails;
import es.ubu.inf.tfg.reservation.details.ReservationStatus;
import es.ubu.inf.tfg.reservation.diningTable.DiningTable;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Table(name = "reservations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(onlyExplicitlyIncluded = true)
@Builder
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    @ToString.Include
    private Integer id;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ReservationStatus status = ReservationStatus.CONFIRMED;

    @Embedded
    private GuestInfo guestInfo;

    @Embedded  
    private ReservationDetails reservationDetails;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dining_table_id", nullable = false)
    private DiningTable diningTable;


    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;


    // --------------------------------------------------------

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
