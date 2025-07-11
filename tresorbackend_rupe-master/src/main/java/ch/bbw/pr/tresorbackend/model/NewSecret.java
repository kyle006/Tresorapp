package ch.bbw.pr.tresorbackend.model;

import com.fasterxml.jackson.databind.JsonNode;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * NewSecret
 * @author Peter Rutschmann
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class NewSecret {
   @NotNull (message="secret is required.")
   private JsonNode content;

   @NotEmpty (message="encryption password is required.")
   @ToString.Exclude
   private String encryptPassword;
}