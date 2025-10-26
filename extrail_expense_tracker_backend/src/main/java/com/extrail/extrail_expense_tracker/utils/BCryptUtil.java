package com.extrail.extrail_expense_tracker.utils;

// import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class BCryptUtil {
    // public static String hash(String raw) { 
    //     return BCrypt.hashpw(raw, BCrypt.gensalt()); 
    // }

    // public static boolean verify(String raw, String hashed) { 
    //     return BCrypt.checkpw(raw, hashed); 
    // }

    private static final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

    public static String passwordHash(String plainPassword) { 
        return passwordEncoder.encode(plainPassword); 
    }

    public static boolean verifyPassword(String plainPassword, String hashedPassword) { 
        return passwordEncoder.matches(plainPassword, hashedPassword); 
    }
}
