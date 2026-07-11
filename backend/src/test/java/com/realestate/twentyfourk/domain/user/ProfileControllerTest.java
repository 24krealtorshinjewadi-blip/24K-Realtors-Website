package com.realestate.twentyfourk.domain.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.realestate.twentyfourk.TwentyFourKRealEstateApplication;
import com.realestate.twentyfourk.security.AuthController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = TwentyFourKRealEstateApplication.class)
@AutoConfigureMockMvc
@Transactional
public class ProfileControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testProfileEndpointsWithRealToken() throws Exception {
        // 1. Authenticate to get real JWT Token
        AuthController.LoginRequest loginRequest = new AuthController.LoginRequest("Manish", "Manish@993100");
        
        MvcResult loginResult = mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();
                
        String responseContent = loginResult.getResponse().getContentAsString();
        AuthController.AuthResponse authResponse = objectMapper.readValue(responseContent, AuthController.AuthResponse.class);
        String token = authResponse.token();

        // 2. Test GET /api/v1/profile
        mockMvc.perform(get("/api/v1/profile")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("Manish"))
                .andExpect(jsonPath("$.email").value("24krealtorshinjewadi@gmail.com"));

        // 3. Test PUT /api/v1/profile
        ProfileController.ProfileUpdateRequest updateRequest = new ProfileController.ProfileUpdateRequest();
        updateRequest.setFullName("Manish Kumar Rai");
        updateRequest.setEmail("24krealtorshinjewadi@gmail.com");
        updateRequest.setPhone("+919673000053");

        mockMvc.perform(put("/api/v1/profile")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("Manish Kumar Rai"));
    }
}
