package es.ubu.inf.tfg.user;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {   
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
}
