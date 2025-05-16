package ch.bbw.pr.tresorbackend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * User
 * @author Peter Rutschmann
 */
@Entity
@Data
@NoArgsConstructor
@Table(name = "user")
public class User {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @Column(nullable = false)
   private String firstName;

   @Column(nullable = false)
   private String lastName;

   @Column(nullable = false, unique = true)
   private String email;

   @Column(nullable = false)
   private String password;

   @Column(nullable = false)
   private String salt;

   public User(Long id, String firstName, String lastName, String email, String password, String salt) {
      this.id = id;
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email;
      this.password = password;
      this.salt = salt;
   }
}