package com.realestate.twentyfourk.config;

import com.realestate.twentyfourk.domain.agent.Agent;
import com.realestate.twentyfourk.domain.agent.AgentRepository;
import com.realestate.twentyfourk.domain.lead.Lead;
import com.realestate.twentyfourk.domain.lead.LeadRepository;
import com.realestate.twentyfourk.domain.lead.LeadRequirementType;
import com.realestate.twentyfourk.domain.lead.LeadStatus;
import com.realestate.twentyfourk.domain.property.*;
import com.realestate.twentyfourk.domain.user.User;
import com.realestate.twentyfourk.domain.user.UserRepository;
import com.realestate.twentyfourk.domain.user.UserRole;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSeeder.class);

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final LeadRepository leadRepository;
    private final PasswordEncoder passwordEncoder;
    private final AgentRepository agentRepository;

    @Override
    public void run(String... args) {
        log.info("Running platform seeder checks...");
        seedAdminUser();
        seedAgents();
        seedProperties();
        seedLeads();
    }

    private void seedAdminUser() {
        if (userRepository.count() == 0) {
            log.info("Seeding default administrator credentials...");
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("adminpassword"))
                    .role(UserRole.ADMIN)
                    .build();
            userRepository.save(admin);
            log.info("Admin user created successfully (username: 'admin', password: 'adminpassword')");
        }
    }

    private void seedAgents() {
        if (agentRepository.count() == 0) {
            log.info("Seeding relationship managers (agents)...");
            Agent agent1 = Agent.builder()
                    .name("Amit Verma")
                    .phone("+919876543201")
                    .email("amit.verma@24krealtors.com")
                    .active(true)
                    .build();
            Agent agent2 = Agent.builder()
                    .name("Neha Kulkarni")
                    .phone("+919876543202")
                    .email("neha.kulkarni@24krealtors.com")
                    .active(true)
                    .build();
            Agent agent3 = Agent.builder()
                    .name("Rahul Patil")
                    .phone("+919876543203")
                    .email("rahul.patil@24krealtors.com")
                    .active(true)
                    .build();
            agentRepository.saveAll(List.of(agent1, agent2, agent3));
            log.info("Seeded 3 active relationship managers.");
        }
    }

    private void seedProperties() {
        if (propertyRepository.count() == 0) {
            log.info("Seeding signature real estate listings...");
            
            Property prop1 = Property.builder()
                    .title("24K Opula Premium 3 BHK")
                    .description("Luxurious residential apartments with modular kitchens, located on Baner-Balewadi Link Road, close to prime IT corridors.")
                    .propertyType(PropertyType.RESIDENTIAL)
                    .transactionType(TransactionType.BUY)
                    .price(new BigDecimal("14500000")) // 1.45 Cr
                    .areaSquareFeet(1650.0)
                    .location(PrimeCorridor.BANER)
                    .address("Baner-Balewadi Link Road, near Balewadi High Street, Pune")
                    .latitude(18.5590)
                    .longitude(73.7868)
                    .bedrooms(3)
                    .bathrooms(3)
                    .status(PropertyStatus.AVAILABLE)
                    .verifiedListing(true)
                    .exclusiveDeal(true)
                    .reraNumber("RERA-PUN-PRM-24K091")
                    .build();

            Property prop2 = Property.builder()
                    .title("24K Altura Smart 2 BHK")
                    .description("Modern apartments with smart automation, located in the heart of Wakad, near Datta Mandir road, offering excellent connectivity.")
                    .propertyType(PropertyType.RESIDENTIAL)
                    .transactionType(TransactionType.BUY)
                    .price(new BigDecimal("8200000")) // 82 L
                    .areaSquareFeet(1100.0)
                    .location(PrimeCorridor.WAKAD)
                    .address("Datta Mandir Road, Wakad, Pune")
                    .latitude(18.5987)
                    .longitude(73.7707)
                    .bedrooms(2)
                    .bathrooms(2)
                    .status(PropertyStatus.AVAILABLE)
                    .verifiedListing(true)
                    .reraNumber("RERA-PUN-PRM-24K074")
                    .build();

            Property prop3 = Property.builder()
                    .title("Hinjewadi IT Plaza Office Space")
                    .description("Plug-and-play commercial space in Hinjewadi Phase 1, fully furnished with conference rooms, cabins, and cafeteria access.")
                    .propertyType(PropertyType.COMMERCIAL)
                    .transactionType(TransactionType.RENT)
                    .price(new BigDecimal("250000")) // 2.5 L/month
                    .areaSquareFeet(4500.0)
                    .location(PrimeCorridor.HINJEWADI)
                    .address("Phase 1, Rajiv Gandhi Infotech Park, Hinjewadi, Pune")
                    .latitude(18.5913)
                    .longitude(73.7389)
                    .bedrooms(0)
                    .bathrooms(4)
                    .status(PropertyStatus.AVAILABLE)
                    .verifiedListing(true)
                    .noBrokerage(true)
                    .reraNumber("RERA-PUN-PRM-24K118")
                    .build();

            Property prop4 = Property.builder()
                    .title("Balewadi High Street Retail Showroom")
                    .description("Prime retail space on Balewadi High Street, offering high footfall, dual frontage, and premium glass architecture.")
                    .propertyType(PropertyType.COMMERCIAL)
                    .transactionType(TransactionType.RENT)
                    .price(new BigDecimal("180000")) // 1.8 L/month
                    .areaSquareFeet(1800.0)
                    .location(PrimeCorridor.BALEWADI)
                    .address("Balewadi High Street, Balewadi, Pune")
                    .latitude(18.5779)
                    .longitude(73.7816)
                    .bedrooms(0)
                    .bathrooms(2)
                    .status(PropertyStatus.AVAILABLE)
                    .noBrokerage(true)
                    .reraNumber("RERA-PUN-PRM-24K085")
                    .build();

            Property prop5 = Property.builder()
                    .title("24K Glitterati Elite 4 BHK Penthouse")
                    .description("Super-spacious ultra-luxury penthouse with private deck, panoramic views, and premium automation fittings in Tathawade.")
                    .propertyType(PropertyType.RESIDENTIAL)
                    .transactionType(TransactionType.BUY)
                    .price(new BigDecimal("19500000")) // 1.95 Cr
                    .areaSquareFeet(2800.0)
                    .location(PrimeCorridor.TATHAWADE)
                    .address("Tathawade Road, near D.Y. Patil University, Pune")
                    .latitude(18.6225)
                    .longitude(73.7547)
                    .bedrooms(4)
                    .bathrooms(4)
                    .status(PropertyStatus.AVAILABLE)
                    .verifiedListing(true)
                    .exclusiveDeal(true)
                    .reraNumber("RERA-PUN-PRM-24K041")
                    .build();

            Property prop6 = Property.builder()
                    .title("Baner Corporate Tower Studio")
                    .description("Premium corporate desk workspace office studio unit, ideal for startups and consultancy services.")
                    .propertyType(PropertyType.COMMERCIAL)
                    .transactionType(TransactionType.BUY)
                    .price(new BigDecimal("12500000")) // 1.25 Cr
                    .areaSquareFeet(950.0)
                    .location(PrimeCorridor.BANER)
                    .address("Main Baner Road, near Pan Card Club Road, Pune")
                    .latitude(18.5620)
                    .longitude(73.7820)
                    .bedrooms(0)
                    .bathrooms(1)
                    .status(PropertyStatus.AVAILABLE)
                    .noBrokerage(true)
                    .reraNumber("RERA-PUN-PRM-24K199")
                    .build();

            Property prop7 = Property.builder()
                    .title("24K Mahalunge Oasis 3 BHK")
                    .description("Premium apartments featuring state-of-the-art ventilation, modular configurations, and scenic views in Mahalunge.")
                    .propertyType(PropertyType.RESIDENTIAL)
                    .transactionType(TransactionType.BUY)
                    .price(new BigDecimal("11000000")) // 1.10 Cr
                    .areaSquareFeet(1400.0)
                    .location(PrimeCorridor.MAHALUNGE)
                    .address("Near Nande-Balewadi Road, Mahalunge, Pune")
                    .latitude(18.5830)
                    .longitude(73.7490)
                    .bedrooms(3)
                    .bathrooms(3)
                    .status(PropertyStatus.AVAILABLE)
                    .verifiedListing(true)
                    .noBrokerage(true)
                    .reraNumber("RERA-PUN-PRM-24K212")
                    .build();

            propertyRepository.saveAll(List.of(prop1, prop2, prop3, prop4, prop5, prop6, prop7));
            log.info("Seeded 7 signature listings successfully.");
        }
    }

    private void seedLeads() {
        if (leadRepository.count() == 0) {
            log.info("Seeding sample leads pipeline data...");
            List<Agent> agents = agentRepository.findByActiveTrue();
            Agent a1 = !agents.isEmpty() ? agents.get(0) : null;
            Agent a2 = agents.size() > 1 ? agents.get(1) : null;
            Agent a3 = agents.size() > 2 ? agents.get(2) : null;

            Lead lead1 = Lead.builder()
                    .name("Rohan Sharma")
                    .phone("+919876543210")
                    .email("rohan.sharma@gmail.com")
                    .requirementType(LeadRequirementType.BUY)
                    .budgetMin(new BigDecimal("12000000"))
                    .budgetMax(new BigDecimal("16000000"))
                    .preferredLocation(PrimeCorridor.BANER)
                    .status(LeadStatus.NEW)
                    .notes("Enquired for 24K Opula. Prefers higher floor, Vaastu compliant.")
                    .assignedAgent(a1)
                    .build();

            Lead lead2 = Lead.builder()
                    .name("Priya Patel")
                    .phone("+919123456789")
                    .email("priya.patel@outlook.com")
                    .requirementType(LeadRequirementType.BUY)
                    .budgetMin(new BigDecimal("7500000"))
                    .budgetMax(new BigDecimal("9000000"))
                    .preferredLocation(PrimeCorridor.WAKAD)
                    .status(LeadStatus.IN_PROGRESS)
                    .notes("Interested in 24K Altura. Needs details on home loan tie-ups.")
                    .assignedAgent(a2)
                    .build();

            Lead lead3 = Lead.builder()
                    .name("Vikram Malhotra")
                    .phone("+919988776655")
                    .email("vikram@techcorp.in")
                    .requirementType(LeadRequirementType.CONSULTATION)
                    .budgetMin(new BigDecimal("200000"))
                    .budgetMax(new BigDecimal("300000"))
                    .preferredLocation(PrimeCorridor.HINJEWADI)
                    .status(LeadStatus.VISITED)
                    .notes("Requires commercial workspace for IT team. Visited Tech Center, likes office layout.")
                    .assignedAgent(a3)
                    .build();

            leadRepository.saveAll(List.of(lead1, lead2, lead3));
            log.info("Seeded 3 leads successfully.");
        }
    }
}
