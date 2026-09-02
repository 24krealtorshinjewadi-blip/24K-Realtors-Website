package com.realestate.twentyfourk.domain.lead;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.realestate.twentyfourk.TwentyFourKRealEstateApplication;
import com.realestate.twentyfourk.domain.lead.dto.LeadRequest;
import com.realestate.twentyfourk.domain.lead.dto.LeadResponse;
import com.realestate.twentyfourk.domain.property.PrimeCorridor;
import com.realestate.twentyfourk.security.AuthController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(
    classes = TwentyFourKRealEstateApplication.class,
    properties = {
        "JWT_SECRET=dGhpc0lzQVZlcnlTZWN1cmVLZXlGb3IyNEtSZWFsdG9yc0NSTSsyMDI0VGVzdGluZ1B1cnBvc2VzT25seQ==",
        "ADMIN_USERNAME=Manish",
        "ADMIN_PASSWORD=Manish@993100",
        "RESEND_API_KEY=test_resend_dummy",
        "WHATSAPP_API_TOKEN=test_whatsapp_dummy"
    }
)
@AutoConfigureMockMvc
@Transactional
public class LeadLifecycleIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testFullLeadLifecycleWithTimeline() throws Exception {
        // 1. Authenticate to get CRM JWT
        AuthController.LoginRequest loginRequest = new AuthController.LoginRequest("Manish", "Manish@24K2026!");
        MvcResult loginResult = mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String responseContent = loginResult.getResponse().getContentAsString();
        AuthController.AuthResponse authResponse = objectMapper.readValue(responseContent, AuthController.AuthResponse.class);
        String token = authResponse.token();

        // 2. Create Lead (POST /api/v1/leads)
        LeadRequest createReq = new LeadRequest(
                "Aarav Singhania",
                "+919822011223",
                "aarav.singhania@example.com",
                LeadRequirementType.BUY,
                new BigDecimal("12000000"),
                new BigDecimal("25000000"),
                PrimeCorridor.BANER,
                LeadStatus.NEW,
                "Looking for luxury 4 BHK in Baner, immediate possession",
                null
        );

        MvcResult createResult = mockMvc.perform(post("/api/v1/leads")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("Aarav Singhania"))
                .andExpect(jsonPath("$.status").value("NEW"))
                .andExpect(jsonPath("$.leadScore").isNumber())
                .andReturn();

        LeadResponse createdLead = objectMapper.readValue(createResult.getResponse().getContentAsString(), LeadResponse.class);
        UUID leadId = createdLead.id();

        // 3. Verify initial system timeline activity created automatically
        mockMvc.perform(get("/api/v1/leads/" + leadId + "/timeline")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].activityType").value("SYSTEM"))
                .andExpect(jsonPath("$[0].subject").value("Lead Created"));

        // 4. Update Lead Status to QUALIFIED (PATCH /api/v1/leads/{id}/status?status=QUALIFIED)
        mockMvc.perform(patch("/api/v1/leads/" + leadId + "/status?status=QUALIFIED")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("QUALIFIED"));

        // 5. Update Lead Details (PUT /api/v1/leads/{id})
        LeadRequest updateReq = new LeadRequest(
                "Aarav Singhania (VIP)",
                "+919822011223",
                "aarav.vip@example.com",
                LeadRequirementType.BUY,
                new BigDecimal("15000000"),
                new BigDecimal("30000000"),
                PrimeCorridor.BANER,
                LeadStatus.QUALIFIED,
                "Upgraded budget to 3 Cr after initial consultation",
                null
        );

        mockMvc.perform(put("/api/v1/leads/" + leadId)
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Aarav Singhania (VIP)"))
                .andExpect(jsonPath("$.budgetMax").value(30000000));

        // 6. Log manual agent call activity (POST /api/v1/leads/{id}/timeline)
        String activityPayload = "{\"activityType\":\"CALL\",\"subject\":\"Follow-up Call with Client\",\"details\":\"Client requested brochure for Panchshil towers\"}";
        mockMvc.perform(post("/api/v1/leads/" + leadId + "/timeline")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(activityPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.activityType").value("CALL"))
                .andExpect(jsonPath("$.subject").value("Follow-up Call with Client"));

        // 7. Verify full timeline chain (at least 4 events: CALL, NOTE, STATUS_CHANGE, SYSTEM)
        mockMvc.perform(get("/api/v1/leads/" + leadId + "/timeline")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(org.hamcrest.Matchers.greaterThanOrEqualTo(3)));
    }
}
