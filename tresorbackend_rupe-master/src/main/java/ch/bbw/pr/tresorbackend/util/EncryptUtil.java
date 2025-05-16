package ch.bbw.pr.tresorbackend.util;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;
import java.security.SecureRandom;
import java.security.spec.KeySpec;
import java.util.Base64;

/**
 * EncryptUtil
 * Used to encrypt content.
 * Not implemented yet.
 * @author Peter Rutschmann
 */
public class EncryptUtil {
   private static final String ENCRYPT_ALGO = "AES/GCM/NoPadding";
   private static final int GCM_IV_SIZE = 12;
   private static final int GCM_TAG_LENGTH = 128;

   private static final String SECRET_KEY_ALGO = "PBKDF2WithHmacSHA1";
   private static final int SECRET_KEY_LENGTH = 256;

   private final SecretKey secretKey;
   private final GCMParameterSpec iv;

   public EncryptUtil(String secretKey, String salt, byte[] iv) {
      this.secretKey = getKeyFromPassword(secretKey, salt);
      this.iv = createGCMParameterSpec(iv);
   }

   //5.1 Verschlüsseln
   public String encrypt(String data) {
      try {
         Cipher cipher = Cipher.getInstance(ENCRYPT_ALGO);

         cipher.init(Cipher.ENCRYPT_MODE, this.secretKey, this.iv);

         byte[] cipherText = cipher.doFinal(data.getBytes());

         return Base64.getEncoder().encodeToString(cipherText);
      } catch (Exception exception){
         exception.printStackTrace();
      }

      return null;
   }

    //5.1 Entschlüsseln
   public String decrypt(String data) {
      try {
         Cipher cipher = Cipher.getInstance(ENCRYPT_ALGO);

         cipher.init(Cipher.DECRYPT_MODE, this.secretKey, this.iv);

         byte[] plainText = cipher.doFinal(Base64.getDecoder().decode(data));

         return new String(plainText);
      } catch (Exception exception) {
         exception.printStackTrace();
      }

      return null;
   }

   public static String generateSalt(int size) {
      SecureRandom random = new SecureRandom();
      byte[] salt = new byte[size];
      random.nextBytes(salt);
      return Base64.getEncoder().encodeToString(salt);
   }

   // 4.3 IV generieren
   public static GCMParameterSpec generateIv() {
      byte[] iv = new byte[GCM_IV_SIZE];

      new SecureRandom().nextBytes(iv);

      return new GCMParameterSpec(GCM_TAG_LENGTH, iv);
   }

   private static GCMParameterSpec createGCMParameterSpec(byte[] iv) {
      return new GCMParameterSpec(GCM_TAG_LENGTH, iv);
   }

   //4.2 AES-Key from Password and salt
   private static SecretKey getKeyFromPassword(String password, String salt) {
      try {
         SecretKeyFactory factory = SecretKeyFactory.getInstance(SECRET_KEY_ALGO);
         KeySpec spec = new PBEKeySpec(password.toCharArray(), salt.getBytes(), 65536, SECRET_KEY_LENGTH);
         SecretKey secret = new SecretKeySpec(factory.generateSecret(spec).getEncoded(), "AES");

         return secret;
      } catch (Exception exception) {
         exception.printStackTrace();
      }
      return  null;
   }
}