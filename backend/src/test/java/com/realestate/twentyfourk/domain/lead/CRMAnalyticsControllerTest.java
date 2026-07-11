package com.realestate.twentyfourk.domain.lead;

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
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = TwentyFourKRealEstateApplication.class)
@AutoConfigureMockMvc
@Transactional
public class CRMAnalyticsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testAnalyticsEndpointsWithRealToken() throws Exception {
        // 1. Authenticate to get real JWT Token for admin/manager role
        AuthController.LoginRequest loginRequest = new AuthController.LoginRequest("Manish", "Manish@993100");
        
        MvcResult loginResult = mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();
                
        String responseContent = loginResult.getResponse().getContentAsString();
        AuthController.AuthResponse authResponse = objectMapper.readValue(responseContent, AuthController.AuthResponse.class);
        String token = authResponse.token();

        // 2. Test GET /api/v1/crm/analytics/summary
        mockMvc.perform(get("/api/v1/crm/analytics/summary")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalLeads").exists())
                .andExpect(jsonPath("$.totalBookings").exists())
                .andExpect(jsonPath("$.totalSiteVisits").exists());

        // 3. Test GET /api/v1/crm/analytics/lead-conversion
        mockMvc.perform(get("/api/v1/crm/analytics/lead-conversion")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.NEW").exists())
                .andExpect(jsonPath("$.CONVERTED").exists());

        // 4. Test GET /api/v1/crm/analytics/site-visit-stats
        mockMvc.perform(get("/api/v1/crm/analytics/site-visit-stats")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").exists())
                .andExpect(jsonPath("$.checkedIn").exists());
    }
}
