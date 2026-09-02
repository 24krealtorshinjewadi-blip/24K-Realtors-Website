package com.realestate.twentyfourk.domain.customer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.realestate.twentyfourk.TwentyFourKRealEstateApplication;
import com.realestate.twentyfourk.domain.customer.dto.CustomerRequest;
import com.realestate.twentyfourk.domain.customer.dto.CustomerResponse;
import com.realestate.twentyfourk.domain.lead.LeadRequirementType;
import com.realestate.twentyfourk.domain.lead.LeadStatus;
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
        "ADMIN_PASSWORD=Manish@24K2026!",
        "RESEND_API_KEY=test_resend_dummy",
        "WHATSAPP_API_TOKEN=test_whatsapp_dummy"
    }
)
@AutoConfigureMockMvc
@Transactional
public class CustomerLifecycleIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testCustomer360LifecycleAndLeadConversion() throws Exception {
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

        // 2. Create New Customer Profile (POST /api/v1/customers)
        CustomerRequest createReq = new CustomerRequest(
                "Vikramaditya Birla",
                "+919890012345",
                "vikram.birla@birlaestate.com",
                "+919890099999",
                "ABCDE1234F",
                "123456789012",
                "Pune",
                "Maharashtra",
                "Penthouse 401, Koregaon Park Annexe",
                CustomerType.HNI_INVESTOR,
                KycStatus.PENDING,
                new BigDecimal("45000000"),
                null,
                "Interested in commercial floors in Kharadi and Baner penthouses"
        );

        MvcResult createResult = mockMvc.perform(post("/api/v1/customers")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("Vikramaditya Birla"))
                .andExpect(jsonPath("$.customerType").value("HNI_INVESTOR"))
                .andExpect(jsonPath("$.kycStatus").value("PENDING"))
                .andReturn();

        CustomerResponse customer = objectMapper.readValue(createResult.getResponse().getContentAsString(), CustomerResponse.class);
        UUID customerId = customer.id();

        // 3. Fetch Customer 360 Detail (GET /api/v1/customers/{id})
        mockMvc.perform(get("/api/v1/customers/" + customerId)
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Vikramaditya Birla"))
                .andExpect(jsonPath("$.panNumber").value("ABCDE1234F"));

        // 4. Update KYC Status to VERIFIED (PATCH /api/v1/customers/{id}/kyc?status=VERIFIED)
        mockMvc.perform(patch("/api/v1/customers/" + customerId + "/kyc?status=VERIFIED")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.kycStatus").value("VERIFIED"));

        // 5. Query Customer Portfolio Stats (GET /api/v1/customers/stats)
        mockMvc.perform(get("/api/v1/customers/stats")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalCustomers").isNumber())
                .andExpect(jsonPath("$.hniInvestors").isNumber())
                .andExpect(jsonPath("$.kycVerified").value(org.hamcrest.Matchers.greaterThanOrEqualTo(1)));

        // 6. Test Lead Conversion to Customer 360 (POST /api/v1/customers/convert-lead/{leadId})
        // First create a Lead
        LeadRequest leadReq = new LeadRequest(
                "Rohit Sharma",
                "+919922334455",
                "rohit.sharma@example.com",
                LeadRequirementType.BUY,
                new BigDecimal("28000000"),
                new BigDecimal("40000000"),
                PrimeCorridor.KHARADI,
                LeadStatus.WON,
                "Ready for registry",
                null
        );

        MvcResult leadRes = mockMvc.perform(post("/api/v1/leads")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(leadReq)))
                .andExpect(status().isCreated())
                .andReturn();

        LeadResponse createdLead = objectMapper.readValue(leadRes.getResponse().getContentAsString(), LeadResponse.class);

        // Convert Lead into Customer
        mockMvc.perform(post("/api/v1/customers/convert-lead/" + createdLead.id())
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Rohit Sharma"))
                .andExpect(jsonPath("$.customerType").value("HNI_INVESTOR")) // >= 2.5 Cr budget
                .andExpect(jsonPath("$.convertedFromLeadId").value(createdLead.id().toString()));

        // Verify Lead status changed to CONVERTED
        mockMvc.perform(get("/api/v1/leads/" + createdLead.id())
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CONVERTED"));
    }
}
