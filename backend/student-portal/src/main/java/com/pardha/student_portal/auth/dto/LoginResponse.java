package com.pardha.student_portal.auth.dto;

public record LoginResponse(
		 String accessToken,
	        String refreshToken,
	        String role,
	        String fullName
		) {

}
