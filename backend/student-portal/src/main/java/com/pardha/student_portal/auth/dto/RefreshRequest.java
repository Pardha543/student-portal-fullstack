package com.pardha.student_portal.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record RefreshRequest(
		 @NotBlank String refreshToken
		) {

}
