package com.pardha.student_portal;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.pardha.student_portal.users.Role;
import com.pardha.student_portal.users.User;
import com.pardha.student_portal.users.UserRepository;

@SpringBootApplication
public class StudentPortalApplication {

	public static void main(String[] args) {
		SpringApplication.run(StudentPortalApplication.class, args);
	}
    @Bean
    CommandLineRunner seedAdmin(UserRepository repo, PasswordEncoder encoder) {
        return args -> {
            String email = "admin@portal.com";
            if (!repo.existsByEmail(email)) {
                User admin = new User();
                admin.setFullName("System Admin");
                admin.setEmail(email);
                admin.setPasswordHash(encoder.encode("Admin@123"));
                admin.setRole(Role.ADMIN);
                repo.save(admin);
            }
        };
    }

}
