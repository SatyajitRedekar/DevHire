package com.devhire.service;

import com.devhire.model.User;
import com.devhire.model.UserRole;
import com.devhire.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User registerUser(String fullName, String email, String password, String roleStr) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Email already in use");
        }

        // Map role string (e.g. JOBSEEKER or SEEKER to SEEKER)
        UserRole role = UserRole.SEEKER;
        if ("RECRUITER".equalsIgnoreCase(roleStr)) {
            role = UserRole.RECRUITER;
        } else if ("ADMIN".equalsIgnoreCase(roleStr)) {
            role = UserRole.ADMIN;
        }

        String passwordHash = passwordEncoder.encode(password);
        User user = new User(fullName, email, passwordHash, role);
        return userRepository.save(user);
    }

    public Optional<User> loginUser(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();

            // 1. Try standard BCrypt verification first
            try {
                if (passwordEncoder.matches(password, user.getPasswordHash())) {
                    return Optional.of(user);
                }
            } catch (Exception ex) {
                // BCrypt match might throw if the database hash has an incompatible format (e.g. SHA-256)
            }

            // 2. Fallback to SHA-256 checking for backward compatibility
            String sha256Hash = hashPasswordSha256(password);
            if (user.getPasswordHash().equals(sha256Hash)) {
                // Migrate the user's hash to BCrypt on-the-fly
                user.setPasswordHash(passwordEncoder.encode(password));
                userRepository.save(user);
                return Optional.of(user);
            }
        }
        return Optional.empty();
    }

    private String hashPasswordSha256(String password) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception ex) {
            throw new RuntimeException("Error hashing password", ex);
        }
    }
}
