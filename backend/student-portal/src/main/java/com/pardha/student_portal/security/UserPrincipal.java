package com.pardha.student_portal.security;

import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.pardha.student_portal.users.User;

public record UserPrincipal(User user) implements UserDetails  {
	 @Override public List<SimpleGrantedAuthority> getAuthorities() {
		    return List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
		  }
		  @Override public String getPassword() { return user.getPasswordHash(); }
		  @Override public String getUsername() { return user.getEmail(); }
		  @Override public boolean isAccountNonExpired() { return true; }
		  @Override public boolean isAccountNonLocked() { return true; }
		  @Override public boolean isCredentialsNonExpired() { return true; }
		  @Override public boolean isEnabled() { return true; }
}
