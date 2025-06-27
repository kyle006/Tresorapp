package ch.bbw.pr.tresorbackend.repository;

import ch.bbw.pr.tresorbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

/**
 * UserRepository
 * @author Peter Rutschmann
 */
public interface UserRepository extends JpaRepository<User, Long> {
   Optional<User> findByEmail(String email);

   @Override
   long count();
}
