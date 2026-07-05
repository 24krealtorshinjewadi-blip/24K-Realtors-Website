package com.realestate.twentyfourk.config;

import com.realestate.twentyfourk.domain.agent.Agent;
import com.realestate.twentyfourk.domain.agent.AgentRepository;
import com.realestate.twentyfourk.domain.attendance.Attendance;
import com.realestate.twentyfourk.domain.attendance.AttendanceRepository;
import com.realestate.twentyfourk.domain.lead.Lead;
import com.realestate.twentyfourk.domain.lead.LeadRepository;
import com.realestate.twentyfourk.domain.lead.LeadRequirementType;
import com.realestate.twentyfourk.domain.lead.LeadStatus;
import com.realestate.twentyfourk.domain.property.*;
import com.realestate.twentyfourk.domain.task.FollowUpTaskRepository;
import com.realestate.twentyfourk.domain.user.User;
import com.realestate.twentyfourk.domain.user.UserRepository;
import com.realestate.twentyfourk.domain.user.UserRole;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
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
    private final FollowUpTaskRepository taskRepository;
    private final AttendanceRepository attendanceRepository;
    private final com.realestate.twentyfourk.domain.builder.BuilderRepository builderRepository;
    private final com.realestate.twentyfourk.domain.society.SocietyRepository societyRepository;

    @Value("${admin.username}")
    private String adminUsername;

    @Value("${admin.password}")
    private String adminPassword;

    @Override
    public void run(String... args) {
        log.info("Running platform seeder checks...");
        seedSystemUsers();
        seedAgents();
        seedBuilders();
        seedSocieties();
        seedProperties();
        seedLeads();
        seedJuneAttendance();
    }

    private void seedSystemUsers() {
        // 1. Super Admin (Manish)
        User admin = userRepository.findByUsername("Manishrai07").orElse(null);

        if (admin == null) {
            // Check if there is any other super admin to rename/synchronize
            var otherSuperAdmins = userRepository.findAll().stream()
                    .filter(u -> u.getRole() == UserRole.SUPER_ADMIN)
                    .toList();
            
            if (!otherSuperAdmins.isEmpty()) {
                admin = otherSuperAdmins.get(0);
                log.info("Renaming existing Super Admin to Manishrai07");
            }
        }

        if (admin == null) {
            // Build new Super Admin
            admin = User.builder()
                    .username("Manishrai07")
                    .password(passwordEncoder.encode("Manish@993100"))
                    .role(UserRole.SUPER_ADMIN)
                    .fullName("Manish Kumar Rai")
                    .email("24krealtorshinjewadi@gmail.com")
                    .phone("+919876543206")
                    .designation("CEO & Principal Partner")
                    .department("Management")
                    .dateOfJoining(java.time.LocalDate.of(2026, 1, 1))
                    .salaryBase(new BigDecimal("250000.00"))
                    .build();
            userRepository.save(admin);
            log.info("Super Admin (Manishrai07) created successfully.");
        } else {
            // Sync credentials and role
            admin.setUsername("Manishrai07");
            admin.setRole(UserRole.SUPER_ADMIN);
            admin.setEmail("24krealtorshinjewadi@gmail.com");
            admin.setFullName("Manish Kumar Rai");
            String newPwd = "Manish@993100";
            if (!passwordEncoder.matches(newPwd, admin.getPassword())) {
                admin.setPassword(passwordEncoder.encode(newPwd));
            }
            userRepository.save(admin);
            log.info("Super Admin (Manishrai07) credentials and role synchronized.");
        }

        // 2. HR Manager
        if (userRepository.findByUsername("hr24k").isEmpty()) {
            User hr = User.builder()
                    .username("hr24k")
                    .password(passwordEncoder.encode("Jyoti.D@24K2026!"))
                    .role(UserRole.HR)
                    .fullName("Jyoti Dhale")
                    .email("jyoti.dhale@24krealtors.com")
                    .phone("+919876543201")
                    .designation("HR & Operations Head")
                    .department("Human Resources")
                    .dateOfJoining(java.time.LocalDate.of(2026, 2, 1))
                    .salaryBase(new BigDecimal("85000.00"))
                    .build();
            userRepository.save(hr);
            log.info("HR user created successfully");
        } else {
            userRepository.findByUsername("hr24k").ifPresent(u -> {
                if (!passwordEncoder.matches("Jyoti.D@24K2026!", u.getPassword())) {
                    u.setPassword(passwordEncoder.encode("Jyoti.D@24K2026!"));
                    userRepository.save(u);
                    log.info("HR password updated to individual password.");
                }
            });
        }

        // 3. Admin / Operations Controller — Neeraj Giri
        if (userRepository.findByUsername("neeraj.giri").isEmpty()) {
            User admin2 = User.builder()
                    .username("neeraj.giri")
                    .password(passwordEncoder.encode("Neeraj@24K2026!"))
                    .role(UserRole.ADMIN)
                    .fullName("Neeraj Giri")
                    .email("neeraj.giri@24krealtors.com")
                    .phone("+919876543205")
                    .designation("CRM Operations Controller")
                    .department("Management")
                    .dateOfJoining(java.time.LocalDate.of(2026, 1, 10))
                    .salaryBase(new BigDecimal("150000.00"))
                    .build();
            userRepository.save(admin2);
            log.info("Admin (Neeraj Giri) user created successfully");
        } else {
            userRepository.findByUsername("neeraj.giri").ifPresent(u -> {
                if (!passwordEncoder.matches("Neeraj@24K2026!", u.getPassword())) {
                    u.setPassword(passwordEncoder.encode("Neeraj@24K2026!"));
                    userRepository.save(u);
                    log.info("Neeraj Giri password updated to individual password.");
                }
            });
        }

        // 4. Sales Manager
        if (userRepository.findByUsername("salesmanager24k").isEmpty()) {
            User sm = User.builder()
                    .username("salesmanager24k")
                    .password(passwordEncoder.encode("Nilesh@24K2026!"))
                    .role(UserRole.SALES_MANAGER)
                    .fullName("Nilesh Rai")
                    .email("nilesh.rai@24krealtors.com")
                    .phone("+919876543204")
                    .designation("Sales & Revenue Manager")
                    .department("Sales")
                    .dateOfJoining(java.time.LocalDate.of(2026, 1, 15))
                    .salaryBase(new BigDecimal("120000.00"))
                    .build();
            userRepository.save(sm);
            log.info("Sales Manager user created successfully");
        } else {
            userRepository.findByUsername("salesmanager24k").ifPresent(u -> {
                if (!passwordEncoder.matches("Nilesh@24K2026!", u.getPassword())) {
                    u.setPassword(passwordEncoder.encode("Nilesh@24K2026!"));
                    userRepository.save(u);
                    log.info("Nilesh Rai password updated to individual password.");
                }
            });
        }

        // 5. Relationship Managers / Advisory RMs
        seedRelationshipManagerUser("jyoti.jagtap", "Jyoti Jagtap", "+919876543202", "jyoti.jagtap@24krealtors.com", "Senior RM", "60000.00", "Jyoti.J@24K2026!");
        seedRelationshipManagerUser("yash.murkute", "Yash Murkute", "+919876543203", "yash.murkute@24krealtors.com", "Associate RM", "45000.00", "Yash@24K2026!");
    }

    private void seedRelationshipManagerUser(String username, String fullName, String phone, String email, String designation, String salary, String individualPassword) {
        if (userRepository.findByUsername(username).isEmpty()) {
            User rm = User.builder()
                    .username(username)
                    .password(passwordEncoder.encode(individualPassword))
                    .role(UserRole.RELATIONSHIP_MANAGER)
                    .fullName(fullName)
                    .email(email)
                    .phone(phone)
                    .designation(designation)
                    .department("Advisory Sales")
                    .dateOfJoining(java.time.LocalDate.of(2026, 3, 1))
                    .salaryBase(new BigDecimal(salary))
                    .build();
            userRepository.save(rm);
            log.info("RM user seeded: {}", username);
        } else {
            userRepository.findByUsername(username).ifPresent(u -> {
                if (!passwordEncoder.matches(individualPassword, u.getPassword())) {
                    u.setPassword(passwordEncoder.encode(individualPassword));
                    userRepository.save(u);
                    log.info("{} password updated to individual password.", username);
                }
            });
        }
    }

    private void seedAgents() {
        if (agentRepository.count() < 6) {
            log.info("Cleaning up old agents, leads and tasks to seed real employees...");
            taskRepository.deleteAll();
            leadRepository.deleteAll();
            agentRepository.deleteAll();

            Agent agent1 = Agent.builder()
                    .name("Neeraj Giri")
                    .phone("+919876543205")
                    .email("neeraj.giri@24krealtors.com")
                    .active(true)
                    .build();
            Agent agent2 = Agent.builder()
                    .name("Jyoti Dhale")
                    .phone("+919876543201")
                    .email("jyoti.dhale@24krealtors.com")
                    .active(true)
                    .build();
            Agent agent3 = Agent.builder()
                    .name("Jyoti Jagtap")
                    .phone("+919876543202")
                    .email("jyoti.jagtap@24krealtors.com")
                    .active(true)
                    .build();
            Agent agent4 = Agent.builder()
                    .name("Yash Murkute")
                    .phone("+919876543203")
                    .email("yash.murkute@24krealtors.com")
                    .active(true)
                    .build();
            Agent agent5 = Agent.builder()
                    .name("Nilesh Rai")
                    .phone("+919876543204")
                    .email("nilesh.rai@24krealtors.com")
                    .active(true)
                    .build();
            Agent agent6 = Agent.builder()
                    .name("Manish Kumar Rai")
                    .phone("+919876543206")
                    .email("24krealtorshinjewadi@gmail.com")
                    .active(true)
                    .build();

            agentRepository.saveAll(List.of(agent1, agent2, agent3, agent4, agent5, agent6));
            log.info("Seeded 6 active employees: Neeraj Giri, Jyoti Dhale, Jyoti Jagtap, Yash Murkute, Nilesh Rai, Manish Kumar Rai");
        }
    }

    private void seedProperties() {
        if (propertyRepository.count() < 20) {
            log.info("Cleaning and seeding 20 premium real estate listings in Hinjewadi/Baner/Wakad...");
            propertyRepository.deleteAll();

            var sOpula = societyRepository.findBySlug("24k-opula-baner").orElse(null);
            var sAltura = societyRepository.findBySlug("24k-altura-wakad").orElse(null);
            var sRepublic = societyRepository.findBySlug("kolte-patil-life-republic-hinjewadi").orElse(null);
            var sJoy = societyRepository.findBySlug("gera-joy-on-the-banks-wakad").orElse(null);
            
            Property prop1 = Property.builder()
                    .title("24K Opula Premium 3 BHK")
                    .description("Luxurious residential apartments with modular kitchens, located on Baner-Balewadi Link Road, close to prime IT corridors. Features premium marble flooring, spacious decks, and piped gas connection.")
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
                    .imageUrl("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80")
                    .videoUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")
                    .threeDTourUrl("https://my.matterport.com/show/?m=JGPmBB6q58g")
                    .furnishingStatus(FurnishingStatus.FULLY_FURNISHED)
                    .gasPipeline(true)
                    .society(sOpula)
                    .build();

            Property prop2 = Property.builder()
                    .title("24K Altura Smart 2 BHK")
                    .description("Modern apartments with smart automation, located in the heart of Wakad, near Datta Mandir road, offering excellent connectivity. Equipped with modular fittings and direct pipeline gas.")
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
                    .imageUrl("https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80")
                    .videoUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")
                    .threeDTourUrl("https://my.matterport.com/show/?m=JGPmBB6q58g")
                    .furnishingStatus(FurnishingStatus.SEMI_FURNISHED)
                    .gasPipeline(true)
                    .society(sAltura)
                    .build();

            Property prop3 = Property.builder()
                    .title("Hinjewadi IT Plaza Office Space")
                    .description("Plug-and-play commercial space in Hinjewadi Phase 1, fully furnished with conference rooms, cabins, and cafeteria access. Excellent location inside Rajiv Gandhi IT Park.")
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
                    .imageUrl("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80")
                    .videoUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")
                    .threeDTourUrl("https://my.matterport.com/show/?m=JGPmBB6q58g")
                    .furnishingStatus(FurnishingStatus.FULLY_FURNISHED)
                    .gasPipeline(false)
                    .build();

            Property prop4 = Property.builder()
                    .title("Balewadi High Street Retail Showroom")
                    .description("Prime retail space on Balewadi High Street, offering high footfall, dual frontage, and premium glass architecture. Ideal for boutique or luxury brand outlet.")
                    .propertyType(PropertyType.COMMERCIAL)
                    .transactionType(TransactionType.RENT)
                    .price(new BigDecimal("18000")) // 18K/month
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
                    .imageUrl("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80")
                    .videoUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")
                    .threeDTourUrl("https://my.matterport.com/show/?m=JGPmBB6q58g")
                    .furnishingStatus(FurnishingStatus.UNFURNISHED)
                    .gasPipeline(false)
                    .build();

            Property prop5 = Property.builder()
                    .title("24K Glitterati Elite 4 BHK Penthouse")
                    .description("Super-spacious ultra-luxury penthouse with private deck, panoramic views, and premium automation fittings in Tathawade. Includes piped gas connection and Italian modular setup.")
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
                    .imageUrl("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80")
                    .videoUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")
                    .threeDTourUrl("https://my.matterport.com/show/?m=JGPmBB6q58g")
                    .furnishingStatus(FurnishingStatus.FULLY_FURNISHED)
                    .gasPipeline(true)
                    .build();

            Property prop6 = Property.builder()
                    .title("Baner Corporate Tower Studio")
                    .description("Premium corporate desk workspace office studio unit, ideal for startups and consultancy services. Centrally located on Baner High Street.")
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
                    .imageUrl("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80")
                    .videoUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")
                    .threeDTourUrl("https://my.matterport.com/show/?m=JGPmBB6q58g")
                    .furnishingStatus(FurnishingStatus.SEMI_FURNISHED)
                    .gasPipeline(false)
                    .build();

            Property prop7 = Property.builder()
                    .title("24K Mahalunge Oasis 3 BHK")
                    .description("Premium apartments featuring state-of-the-art ventilation, modular configurations, and scenic views in Mahalunge. Complete with private amenities and gas connection.")
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
                    .imageUrl("https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80")
                    .videoUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")
                    .threeDTourUrl("https://my.matterport.com/show/?m=JGPmBB6q58g")
                    .furnishingStatus(FurnishingStatus.FULLY_FURNISHED)
                    .gasPipeline(true)
                    .build();

            Property prop8 = Property.builder()
                    .title("Megapolis Splendour 1 BHK")
                    .description("Premium cozy 1 BHK apartment in Megapolis Splendour, Hinjewadi Phase 3. Fully equipped with semi-furnished cabinets, modular kitchen setup, piped gas connection, and private balcony overlooking the IT corridor.")
                    .propertyType(PropertyType.RESIDENTIAL)
                    .transactionType(TransactionType.RENT)
                    .price(new BigDecimal("22000")) // 22K/month
                    .areaSquareFeet(650.0)
                    .location(PrimeCorridor.HINJEWADI)
                    .address("Megapolis Splendour, Phase 3, Hinjewadi, Pune")
                    .latitude(18.5919)
                    .longitude(73.7025)
                    .bedrooms(1)
                    .bathrooms(1)
                    .status(PropertyStatus.AVAILABLE)
                    .verifiedListing(true)
                    .exclusiveDeal(true)
                    .reraNumber("RERA-PUN-PRM-24K301")
                    .imageUrl("https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80")
                    .videoUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")
                    .threeDTourUrl("https://my.matterport.com/show/?m=JGPmBB6q58g")
                    .furnishingStatus(FurnishingStatus.SEMI_FURNISHED)
                    .gasPipeline(true)
                    .build();

            Property prop9 = Property.builder()
                    .title("Godrej Elements Luxury 2 BHK")
                    .description("Modern premium fully-furnished 2 BHK apartment in Godrej Elements, Hinjewadi Phase 1. Features high-end woodwork, smart home automation, modular kitchen, piped gas, and premium accessories.")
                    .propertyType(PropertyType.RESIDENTIAL)
                    .transactionType(TransactionType.RENT)
                    .price(new BigDecimal("28000")) // 28K/month
                    .areaSquareFeet(1150.0)
                    .location(PrimeCorridor.HINJEWADI)
                    .address("Godrej Elements, Phase 1, Hinjewadi, Pune")
                    .latitude(18.5955)
                    .longitude(73.7380)
                    .bedrooms(2)
                    .bathrooms(2)
                    .status(PropertyStatus.AVAILABLE)
                    .verifiedListing(true)
                    .exclusiveDeal(true)
                    .reraNumber("RERA-PUN-PRM-24K302")
                    .imageUrl("https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80")
                    .videoUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")
                    .threeDTourUrl("https://my.matterport.com/show/?m=JGPmBB6q58g")
                    .furnishingStatus(FurnishingStatus.FULLY_FURNISHED)
                    .gasPipeline(true)
                    .build();

            Property prop10 = Property.builder()
                    .title("TCG The Crown Greens 3 BHK")
                    .description("Spacious semi-furnished 3 BHK flat in TCG The Crown Greens, Hinjewadi Phase 2, right next to Embassy Techzone. Boasts three large balconies, modular kitchen, and double parking slots.")
                    .propertyType(PropertyType.RESIDENTIAL)
                    .transactionType(TransactionType.RENT)
                    .price(new BigDecimal("38000")) // 38K/month
                    .areaSquareFeet(1550.0)
                    .location(PrimeCorridor.HINJEWADI)
                    .address("TCG The Crown Greens, Phase 2, Hinjewadi, Pune")
                    .latitude(18.5872)
                    .longitude(73.7251)
                    .bedrooms(3)
                    .bathrooms(3)
                    .status(PropertyStatus.AVAILABLE)
                    .verifiedListing(true)
                    .exclusiveDeal(true)
                    .reraNumber("RERA-PUN-PRM-24K303")
                    .imageUrl("https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80")
                    .videoUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")
                    .threeDTourUrl("https://my.matterport.com/show/?m=JGPmBB6q58g")
                    .furnishingStatus(FurnishingStatus.SEMI_FURNISHED)
                    .gasPipeline(true)
                    .build();

            Property prop11 = Property.builder()
                    .title("Kasturi Apostle Signature 4 BHK")
                    .description("Ultra-luxury expansive 4 BHK residential apartments in Kasturi Apostle, Baner, Pune. Close to Balewadi High Street. Top tier marble fittings and private pool deck.")
                    .propertyType(PropertyType.RESIDENTIAL)
                    .transactionType(TransactionType.BUY)
                    .price(new BigDecimal("22500000")) // 2.25 Cr
                    .areaSquareFeet(3100.0)
                    .location(PrimeCorridor.BANER)
                    .address("Apostle Baner, near Balewadi High Street, Pune")
                    .latitude(18.5680)
                    .longitude(73.7850)
                    .bedrooms(4)
                    .bathrooms(4)
                    .status(PropertyStatus.AVAILABLE)
                    .verifiedListing(true)
                    .exclusiveDeal(true)
                    .reraNumber("RERA-PUN-PRM-24K304")
                    .imageUrl("https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80")
                    .videoUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")
                    .threeDTourUrl("https://my.matterport.com/show/?m=JGPmBB6q58g")
                    .furnishingStatus(FurnishingStatus.FULLY_FURNISHED)
                    .gasPipeline(true)
                    .build();

            Property prop12 = Property.builder()
                    .title("Kolte Patil Life Republic 3 BHK")
                    .description("Premium cozy 3 BHK flat in Kolte Patil Life Republic, Hinjewadi, Pune. Excellent landscaped gardens, luxury modular setup, and 100% power backup.")
                    .propertyType(PropertyType.RESIDENTIAL)
                    .transactionType(TransactionType.BUY)
                    .price(new BigDecimal("10500000")) // 1.05 Cr
                    .areaSquareFeet(1450.0)
                    .location(PrimeCorridor.HINJEWADI)
                    .address("Life Republic Township, Hinjewadi-Marunji, Pune")
                    .latitude(18.6015)
                    .longitude(73.7120)
                    .bedrooms(3)
                    .bathrooms(3)
                    .status(PropertyStatus.AVAILABLE)
                    .verifiedListing(true)
                    .exclusiveDeal(true)
                    .reraNumber("RERA-PUN-PRM-24K305")
                    .imageUrl("https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80")
                    .videoUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")
                    .threeDTourUrl("https://my.matterport.com/show/?m=JGPmBB6q58g")
                    .furnishingStatus(FurnishingStatus.SEMI_FURNISHED)
                    .gasPipeline(true)
                    .society(sRepublic)
                    .build();

            Property prop13 = Property.builder()
                    .title("Gera Joy on the Banks 2 BHK")
                    .description("Brand new kid-centric 2 BHK luxury apartment in Gera Joy on the Banks, Wakad, Pune. Offers high-end automation, central clubhouse access, and safety gates.")
                    .propertyType(PropertyType.RESIDENTIAL)
                    .transactionType(TransactionType.BUY)
                    .price(new BigDecimal("8800000")) // 88 L
                    .areaSquareFeet(1020.0)
                    .location(PrimeCorridor.WAKAD)
                    .address("Joy on the Banks, Wakad, Pune")
                    .latitude(18.5970)
                    .longitude(73.7660)
                    .bedrooms(2)
                    .bathrooms(2)
                    .status(PropertyStatus.AVAILABLE)
                    .verifiedListing(true)
                    .exclusiveDeal(true)
                    .reraNumber("RERA-PUN-PRM-24K306")
                    .imageUrl("https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80")
                    .videoUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")
                    .threeDTourUrl("https://my.matterport.com/show/?m=JGPmBB6q58g")
                    .furnishingStatus(FurnishingStatus.UNFURNISHED)
                    .gasPipeline(true)
                    .society(sJoy)
                    .build();

            Property prop14 = Property.builder()
                    .title("Pride Purple Park Landmark 3 BHK")
                    .description("Spacious 3 BHK signature residence at Pride Purple Park Landmark, Baner. Features premium Italian marble flooring, false ceiling, and large master bedroom layout.")
                    .propertyType(PropertyType.RESIDENTIAL)
                    .transactionType(TransactionType.BUY)
                    .price(new BigDecimal("15500000")) // 1.55 Cr
                    .areaSquareFeet(1600.0)
                    .location(PrimeCorridor.BANER)
                    .address("Park Landmark, Baner, Pune")
                    .latitude(18.5610)
                    .longitude(73.7845)
                    .bedrooms(3)
                    .bathrooms(3)
                    .status(PropertyStatus.AVAILABLE)
                    .verifiedListing(true)
                    .exclusiveDeal(true)
                    .reraNumber("RERA-PUN-PRM-24K307")
                    .imageUrl("https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80")
                    .videoUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")
                    .threeDTourUrl("https://my.matterport.com/show/?m=JGPmBB6q58g")
                    .furnishingStatus(FurnishingStatus.FULLY_FURNISHED)
                    .gasPipeline(true)
                    .build();

            Property prop15 = Property.builder()
                    .title("Megapolis Sunway Cozy 2 BHK")
                    .description("Premium 2 BHK rental apartment in Megapolis Sunway, Hinjewadi Phase 3. Fully equipped kitchen, clean ventilation, and parking space.")
                    .propertyType(PropertyType.RESIDENTIAL)
                    .transactionType(TransactionType.RENT)
                    .price(new BigDecimal("26000")) // 26K/month
                    .areaSquareFeet(980.0)
                    .location(PrimeCorridor.HINJEWADI)
                    .address("Megapolis Sunway, Phase 3, Hinjewadi, Pune")
                    .latitude(18.5900)
                    .longitude(73.7050)
                    .bedrooms(2)
                    .bathrooms(2)
                    .status(PropertyStatus.AVAILABLE)
                    .verifiedListing(true)
                    .exclusiveDeal(false)
                    .reraNumber("RERA-PUN-PRM-24K308")
                    .imageUrl("https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80")
                    .videoUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")
                    .threeDTourUrl("https://my.matterport.com/show/?m=JGPmBB6q58g")
                    .furnishingStatus(FurnishingStatus.SEMI_FURNISHED)
                    .gasPipeline(true)
                    .build();

            Property prop16 = Property.builder()
                    .title("Kohinoor Sportsville Active 3 BHK")
                    .description("Premium sport-centric 3 BHK apartment in Kohinoor Sportsville, Hinjewadi Phase 2. Features international amenities, open landscape, and clean title.")
                    .propertyType(PropertyType.RESIDENTIAL)
                    .transactionType(TransactionType.BUY)
                    .price(new BigDecimal("11200000")) // 1.12 Cr
                    .areaSquareFeet(1350.0)
                    .location(PrimeCorridor.HINJEWADI)
                    .address("Kohinoor Sportsville, Phase 2, Hinjewadi, Pune")
                    .latitude(18.5895)
                    .longitude(73.7290)
                    .bedrooms(3)
                    .bathrooms(3)
                    .status(PropertyStatus.AVAILABLE)
                    .verifiedListing(true)
                    .exclusiveDeal(true)
                    .reraNumber("RERA-PUN-PRM-24K309")
                    .imageUrl("https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80")
                    .videoUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")
                    .threeDTourUrl("https://my.matterport.com/show/?m=JGPmBB6q58g")
                    .furnishingStatus(FurnishingStatus.UNFURNISHED)
                    .gasPipeline(true)
                    .build();

            Property prop17 = Property.builder()
                    .title("VTP Blue Waters Modern 2 BHK")
                    .description("Modern smart 2 BHK flat in VTP Blue Waters (Aers & Leon), Mahalunge-Baner, Pune. Riverfront views, modular layout, and excellent highway connectivity.")
                    .propertyType(PropertyType.RESIDENTIAL)
                    .transactionType(TransactionType.BUY)
                    .price(new BigDecimal("7800000")) // 78 L
                    .areaSquareFeet(900.0)
                    .location(PrimeCorridor.MAHALUNGE)
                    .address("VTP Blue Waters, Mahalunge, Pune")
                    .latitude(18.5790)
                    .longitude(73.7470)
                    .bedrooms(2)
                    .bathrooms(2)
                    .status(PropertyStatus.AVAILABLE)
                    .verifiedListing(true)
                    .exclusiveDeal(false)
                    .reraNumber("RERA-PUN-PRM-24K310")
                    .imageUrl("https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80")
                    .videoUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")
                    .threeDTourUrl("https://my.matterport.com/show/?m=JGPmBB6q58g")
                    .furnishingStatus(FurnishingStatus.SEMI_FURNISHED)
                    .gasPipeline(true)
                    .build();

            Property prop18 = Property.builder()
                    .title("Shapoorji Joyville Premium 2 BHK")
                    .description("State-of-the-art 2 BHK residential apartment at Joyville by Shapoorji Pallonji, Hinjewadi Phase 1. Features high-speed elevators, premium styling, and absolute security.")
                    .propertyType(PropertyType.RESIDENTIAL)
                    .transactionType(TransactionType.BUY)
                    .price(new BigDecimal("8400000")) // 84 L
                    .areaSquareFeet(990.0)
                    .location(PrimeCorridor.HINJEWADI)
                    .address("Joyville Hinjewadi, Near Phase 1 IT Park, Pune")
                    .latitude(18.5990)
                    .longitude(73.7420)
                    .bedrooms(2)
                    .bathrooms(2)
                    .status(PropertyStatus.AVAILABLE)
                    .verifiedListing(true)
                    .exclusiveDeal(true)
                    .reraNumber("RERA-PUN-PRM-24K311")
                    .imageUrl("https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80")
                    .videoUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")
                    .threeDTourUrl("https://my.matterport.com/show/?m=JGPmBB6q58g")
                    .furnishingStatus(FurnishingStatus.UNFURNISHED)
                    .gasPipeline(true)
                    .build();

            Property prop19 = Property.builder()
                    .title("Vilas Javdekar Yashwin 3 BHK")
                    .description("Eco-friendly luxury 3 BHK apartment at Vilas Javdekar Yashwin, Wakad. Offers modular dry balcony setup, robust design, and children play zones.")
                    .propertyType(PropertyType.RESIDENTIAL)
                    .transactionType(TransactionType.BUY)
                    .price(new BigDecimal("9800000")) // 98 L
                    .areaSquareFeet(1280.0)
                    .location(PrimeCorridor.WAKAD)
                    .address("Yashwin Wakad, near highway exit, Wakad, Pune")
                    .latitude(18.5940)
                    .longitude(73.7630)
                    .bedrooms(3)
                    .bathrooms(3)
                    .status(PropertyStatus.AVAILABLE)
                    .verifiedListing(true)
                    .exclusiveDeal(false)
                    .reraNumber("RERA-PUN-PRM-24K312")
                    .imageUrl("https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80")
                    .videoUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")
                    .threeDTourUrl("https://my.matterport.com/show/?m=JGPmBB6q58g")
                    .furnishingStatus(FurnishingStatus.SEMI_FURNISHED)
                    .gasPipeline(true)
                    .build();

            Property prop20 = Property.builder()
                    .title("Lodha Belmondo Golf Luxury Villa")
                    .description("Premium ultra-luxurious 4 BHK villa at Lodha Belmondo, Tathawade highway corridor, overlooking the golf course. Features private gardens, premium security, and absolute elite privacy.")
                    .propertyType(PropertyType.RESIDENTIAL)
                    .transactionType(TransactionType.BUY)
                    .price(new BigDecimal("37500000")) // 3.75 Cr
                    .areaSquareFeet(4200.0)
                    .location(PrimeCorridor.TATHAWADE)
                    .address("Lodha Belmondo, Pune-Mumbai Expressway, Pune")
                    .latitude(18.6410)
                    .longitude(73.6820)
                    .bedrooms(4)
                    .bathrooms(4)
                    .status(PropertyStatus.AVAILABLE)
                    .verifiedListing(true)
                    .exclusiveDeal(true)
                    .reraNumber("RERA-PUN-PRM-24K313")
                    .imageUrl("https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80")
                    .videoUrl("https://www.youtube.com/embed/dQw4w9WgXcQ")
                    .threeDTourUrl("https://my.matterport.com/show/?m=JGPmBB6q58g")
                    .furnishingStatus(FurnishingStatus.FULLY_FURNISHED)
                    .gasPipeline(false)
                    .build();

            propertyRepository.saveAll(List.of(
                    prop1, prop2, prop3, prop4, prop5, prop6, prop7, prop8, prop9, prop10,
                    prop11, prop12, prop13, prop14, prop15, prop16, prop17, prop18, prop19, prop20
            ));
            log.info("Seeded 20 premium real estate listings successfully.");
        }
    }

    private void seedLeads() {
        if (leadRepository.count() == 0) {
            log.info("Seeding sample leads pipeline data...");
            List<Agent> agents = agentRepository.findByActiveTrue();
            Agent a1 = !agents.isEmpty() ? agents.get(0) : null;
            Agent a2 = agents.size() > 1 ? agents.get(1) : null;
            Agent a3 = agents.size() > 2 ? agents.get(2) : null;
            Agent a4 = agents.size() > 3 ? agents.get(3) : null;
            Agent a5 = agents.size() > 4 ? agents.get(4) : null;

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

            Lead lead4 = Lead.builder()
                    .name("Anjali Desai")
                    .phone("+919823456789")
                    .email("anjali.desai@yahoo.com")
                    .requirementType(LeadRequirementType.RENT)
                    .budgetMin(new BigDecimal("40000"))
                    .budgetMax(new BigDecimal("55000"))
                    .preferredLocation(PrimeCorridor.BANER)
                    .status(LeadStatus.CONTACTED)
                    .notes("Looking for fully furnished 3 BHK on rent close to Balewadi High Street.")
                    .assignedAgent(a4)
                    .build();

            Lead lead5 = Lead.builder()
                    .name("Sanjay Joshi")
                    .phone("+919890123456")
                    .email("sanjay.joshi@gmail.com")
                    .requirementType(LeadRequirementType.BUY)
                    .budgetMin(new BigDecimal("21000000"))
                    .budgetMax(new BigDecimal("26000000"))
                    .preferredLocation(PrimeCorridor.TATHAWADE)
                    .status(LeadStatus.CONVERTED)
                    .notes("Interested in premium golf view villa at Lodha Belmondo. Booking confirmed.")
                    .assignedAgent(a5)
                    .build();

            Lead lead6 = Lead.builder()
                    .name("Meera Nair")
                    .phone("+919765432109")
                    .email("meera.nair@hotmail.com")
                    .requirementType(LeadRequirementType.BUY)
                    .budgetMin(new BigDecimal("9500000"))
                    .budgetMax(new BigDecimal("11000000"))
                    .preferredLocation(PrimeCorridor.WAKAD)
                    .status(LeadStatus.NEW)
                    .notes("Enquired for 24K Glitterati. Prefers mid-rise floor, early possession.")
                    .assignedAgent(a5)
                    .build();

            List<Lead> savedLeads = leadRepository.saveAll(List.of(lead1, lead2, lead3, lead4, lead5, lead6));
            log.info("Seeded 6 leads successfully.");

            // Seed tasks associated with these leads
            seedTasks(savedLeads, agents);
        }
    }

    private void seedTasks(List<Lead> leads, List<Agent> agents) {
        log.info("Seeding follow-up tasks...");
        
        java.time.LocalDateTime now = java.time.LocalDateTime.now();

        // Task 1: Overdue Task for Jyoti Dhale (lead 1)
        com.realestate.twentyfourk.domain.task.FollowUpTask t1 = com.realestate.twentyfourk.domain.task.FollowUpTask.builder()
                .lead(leads.get(0))
                .agent(agents.get(0))
                .title("Initial Discovery Call")
                .description("Call Rohan to understand budget expectations and floor choice.")
                .taskType(com.realestate.twentyfourk.domain.task.TaskType.CALL)
                .dueDate(now.minusDays(2))
                .status(com.realestate.twentyfourk.domain.task.TaskStatus.PENDING)
                .priority(com.realestate.twentyfourk.domain.task.TaskPriority.HIGH)
                .build();

        // Task 2: Task due today for Jyoti Jagtap (lead 2)
        com.realestate.twentyfourk.domain.task.FollowUpTask t2 = com.realestate.twentyfourk.domain.task.FollowUpTask.builder()
                .lead(leads.get(1))
                .agent(agents.get(1))
                .title("Home Loan Documents Follow-up")
                .description("Collect salary slips and bank statements from Priya for SBI pre-approval.")
                .taskType(com.realestate.twentyfourk.domain.task.TaskType.EMAIL)
                .dueDate(now.plusHours(4))
                .status(com.realestate.twentyfourk.domain.task.TaskStatus.PENDING)
                .priority(com.realestate.twentyfourk.domain.task.TaskPriority.MEDIUM)
                .build();

        // Task 3: Task completed for Yash Murkute (lead 3)
        com.realestate.twentyfourk.domain.task.FollowUpTask t3 = com.realestate.twentyfourk.domain.task.FollowUpTask.builder()
                .lead(leads.get(2))
                .agent(agents.get(2))
                .title("Showroom Site Visit")
                .description("Accompany Vikram for physical walkthrough of Hinjewadi commercial space.")
                .taskType(com.realestate.twentyfourk.domain.task.TaskType.SITE_VISIT)
                .dueDate(now.minusDays(1))
                .status(com.realestate.twentyfourk.domain.task.TaskStatus.COMPLETED)
                .priority(com.realestate.twentyfourk.domain.task.TaskPriority.HIGH)
                .build();

        // Task 4: Future Task for Nilesh Rai (lead 4)
        com.realestate.twentyfourk.domain.task.FollowUpTask t4 = com.realestate.twentyfourk.domain.task.FollowUpTask.builder()
                .lead(leads.get(3))
                .agent(agents.get(3))
                .title("Arrange 3D Virtual Meeting")
                .description("Host Zoom call to show Anjali 3D layout rendering for Baner rental options.")
                .taskType(com.realestate.twentyfourk.domain.task.TaskType.MEETING)
                .dueDate(now.plusDays(3))
                .status(com.realestate.twentyfourk.domain.task.TaskStatus.PENDING)
                .priority(com.realestate.twentyfourk.domain.task.TaskPriority.LOW)
                .build();

        taskRepository.saveAll(List.of(t1, t2, t3, t4));
        log.info("Seeded 4 sample tasks.");
    }

    private void seedJuneAttendance() {
        // Only seed if no attendance records exist for June 2026
        LocalDate juneStart = LocalDate.of(2026, 6, 2);
        LocalDate juneEnd   = LocalDate.of(2026, 6, 28);
        if (attendanceRepository.findByDate(juneStart).isEmpty()) {
            log.info("Seeding June 2026 attendance records for all employees...");

            List<User> employees = userRepository.findAll().stream()
                    .filter(u -> u.getRole() != null)
                    .toList();

            List<Attendance> records = new ArrayList<>();

            // June 2026 working day patterns per employee
            // Pattern: 0=PRESENT on-time, 1=LATE, 2=ABSENT, 3=PRESENT overtime
            // Neeraj Giri - Very regular, mostly on time
            int[] neerajPattern = {0,0,0,1,0, 0,0,0,0,3, 0,2,0,0,0, 0,0,1,0,0};
            // Manish Kumar Rai - Present but sometimes late (developer hours)
            int[] manishPattern = {0,0,1,0,0, 1,0,0,0,0, 0,0,0,2,0, 0,1,0,0,3};
            // Nilesh Rai - Sales, frequent field visits
            int[] nileshPattern = {0,1,0,0,1, 0,0,2,0,0, 1,0,0,0,0, 3,0,0,1,0};
            // Jyoti Dhale - HR, very disciplined
            int[] jyotiDPattern  = {0,0,0,0,0, 0,1,0,0,0, 0,0,0,0,0, 0,0,0,2,0};
            // Jyoti Jagtap - RM, moderate attendance
            int[] jyotiJPattern  = {0,0,1,0,0, 2,0,0,1,0, 0,0,0,1,0, 0,0,2,0,0};
            // Yash Murkute - RM, junior, some lates
            int[] yashPattern    = {1,0,0,1,0, 0,2,0,1,0, 0,1,0,0,0, 0,0,0,1,0};

            for (User emp : employees) {
                int[] pattern = switch (emp.getUsername()) {
                    case "neeraj.giri"    -> neerajPattern;
                    case "admin24k"       -> manishPattern;
                    case "salesmanager24k"-> nileshPattern;
                    case "hr24k"          -> jyotiDPattern;
                    case "jyoti.jagtap"   -> jyotiJPattern;
                    case "yash.murkute"   -> yashPattern;
                    default -> null;
                };
                if (pattern == null) continue;

                int dayIdx = 0;
                LocalDate current = juneStart;
                while (!current.isAfter(juneEnd)) {
                    // Skip weekends (Saturday=6, Sunday=7)
                    if (current.getDayOfWeek().getValue() >= 6) {
                        current = current.plusDays(1);
                        continue;
                    }
                    if (dayIdx >= pattern.length) break;

                    int type = pattern[dayIdx++];
                    if (type == 2) { // ABSENT — no record
                        current = current.plusDays(1);
                        continue;
                    }

                    LocalDateTime checkIn;
                    LocalDateTime checkOut;
                    boolean isLate = false;
                    int overtimeMinutes = 0;

                    switch (type) {
                        case 1 -> { // LATE — after 9:30
                            checkIn  = current.atTime(9, 45).plusMinutes((int)(Math.random() * 30));
                            checkOut = current.atTime(18, 30).plusMinutes((int)(Math.random() * 20));
                            isLate = true;
                        }
                        case 3 -> { // PRESENT with overtime
                            checkIn  = current.atTime(9, 0).plusMinutes((int)(Math.random() * 20));
                            checkOut = current.atTime(20, 0).plusMinutes((int)(Math.random() * 30));
                            overtimeMinutes = 90;
                        }
                        default -> { // PRESENT on-time
                            checkIn  = current.atTime(9, 0).plusMinutes((int)(Math.random() * 25));
                            checkOut = current.atTime(18, 15).plusMinutes((int)(Math.random() * 30));
                        }
                    }

                    Attendance att = Attendance.builder()
                            .user(emp)
                            .date(current)
                            .checkInTime(checkIn)
                            .checkOutTime(checkOut)
                            .checkInLat(18.583418 + (Math.random() * 0.001 - 0.0005))
                            .checkInLon(73.727354 + (Math.random() * 0.001 - 0.0005))
                            .checkOutLat(18.583418 + (Math.random() * 0.001 - 0.0005))
                            .checkOutLon(73.727354 + (Math.random() * 0.001 - 0.0005))
                            .status(isLate ? "LATE" : "PRESENT")
                            .late(isLate)
                            .earlyExit(false)
                            .overtimeMinutes(overtimeMinutes)
                            .totalBreaksDurationMinutes(30 + (int)(Math.random() * 15))
                            .build();

                    records.add(att);
                    current = current.plusDays(1);
                }
            }

            attendanceRepository.saveAll(records);
            log.info("Seeded {} June 2026 attendance records for {} employees.", records.size(), employees.size());
        } else {
            log.info("June 2026 attendance already seeded, skipping.");
        }
    }

    private void seedBuilders() {
        if (builderRepository.count() == 0) {
            log.info("Seeding initial Builders...");
            var b1 = com.realestate.twentyfourk.domain.builder.Builder.builder()
                    .name("Pride Purple Group")
                    .slug("pride-purple-group")
                    .logoUrl("https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=100&h=100&q=80")
                    .description("Pride Purple Group has been a leader in premium real estate across Pune, Baner, and Wakad for over 20 years.")
                    .experienceYears(20)
                    .completedProjectsCount(35)
                    .ongoingProjectsCount(8)
                    .awards("Best Luxury Developer Pune 2025")
                    .build();

            var b2 = com.realestate.twentyfourk.domain.builder.Builder.builder()
                    .name("Kolte Patil Developers")
                    .slug("kolte-patil-developers")
                    .logoUrl("https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=100&h=100&q=80")
                    .description("Kolte-Patil Developers is a leading public-listed real estate company with a strong presence in Pune.")
                    .experienceYears(30)
                    .completedProjectsCount(60)
                    .ongoingProjectsCount(15)
                    .awards("RERA Certified Quality Builder 2024")
                    .build();

            var b3 = com.realestate.twentyfourk.domain.builder.Builder.builder()
                    .name("Gera Developments")
                    .slug("gera-developments")
                    .logoUrl("https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=100&h=100&q=80")
                    .description("Gera Developments is known for premium residential and commercial projects with customer-centric innovation.")
                    .experienceYears(50)
                    .completedProjectsCount(80)
                    .ongoingProjectsCount(12)
                    .awards("Developer of the Year 2026")
                    .build();

            builderRepository.saveAll(List.of(b1, b2, b3));
        }
    }

    private void seedSocieties() {
        if (societyRepository.count() == 0) {
            log.info("Seeding initial Societies...");
            var pridePurple = builderRepository.findBySlug("pride-purple-group").orElse(null);
            var koltePatil = builderRepository.findBySlug("kolte-patil-developers").orElse(null);
            var gera = builderRepository.findBySlug("gera-developments").orElse(null);

            var s1 = com.realestate.twentyfourk.domain.society.Society.builder()
                    .name("24K Opula")
                    .slug("24k-opula-baner")
                    .location(PrimeCorridor.BANER)
                    .developer("Pride Purple Group")
                    .reraNumber("RERA-PUN-PRM-24K091")
                    .projectStatus("READY_TO_MOVE")
                    .startingPrice(new BigDecimal("14500000"))
                    .possessionDate("December 2025")
                    .overview("Ultra-luxury residential community situated on the Baner-Balewadi Link Road, close to high streets.")
                    .amenities("Infinity Pool, High-tech Gymnasium, Grand Clubhouse, Concierge Lobby, Italian Marble Finish")
                    .configuration("3 BHK, 4 BHK Penthouse")
                    .googleMapsIframe("<iframe src=\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.33333333333!2d73.7868!3d18.5590!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bec!2sBalewadi%20High%20Street!5e0!3m2!1sen!2sin!4v1625118\" width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\"></iframe>")
                    .investmentScore(88)
                    .rentalYield(4.2)
                    .builder(pridePurple)
                    .build();

            var s2 = com.realestate.twentyfourk.domain.society.Society.builder()
                    .name("24K Altura")
                    .slug("24k-altura-wakad")
                    .location(PrimeCorridor.WAKAD)
                    .developer("Kolte Patil Developers")
                    .reraNumber("RERA-PUN-PRM-24K074")
                    .projectStatus("UNDER_CONSTRUCTION")
                    .startingPrice(new BigDecimal("8200000"))
                    .possessionDate("June 2027")
                    .overview("Smart high-rise residences with automated temperature, mood lighting controls and skydecks in Wakad.")
                    .amenities("Sky Lounge, Smart Home Automation, Reflexology Path, Jogging Track, EV Charging Stations")
                    .configuration("2 BHK, 3 BHK")
                    .googleMapsIframe("<iframe src=\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.44444444444!2d73.7707!3d18.5987!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bef!2sWakad!5e0!3m2!1sen!2sin!4v1625118\" width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\"></iframe>")
                    .investmentScore(82)
                    .rentalYield(3.8)
                    .builder(koltePatil)
                    .build();

            var s3 = com.realestate.twentyfourk.domain.society.Society.builder()
                    .name("Kolte Patil Life Republic")
                    .slug("kolte-patil-life-republic-hinjewadi")
                    .location(PrimeCorridor.HINJEWADI)
                    .developer("Kolte Patil Developers")
                    .reraNumber("RERA-PUN-PRM-24K305")
                    .projectStatus("UNDER_CONSTRUCTION")
                    .startingPrice(new BigDecimal("10500000"))
                    .possessionDate("December 2028")
                    .overview("Sprawling township community in Hinjewadi, offering multi-phase premium housing & state-of-the-art infrastructure.")
                    .amenities("Acres of Greenery, Multi-sport Arena, International School, Retail Plaza, Dedicated Fire Station")
                    .configuration("1 BHK, 2 BHK, 3 BHK, Villas")
                    .googleMapsIframe("<iframe src=\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.55555555555!2d73.7120!3d18.6015!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c00!2sHinjewadi!5e0!3m2!1sen!2sin!4v1625118\" width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\"></iframe>")
                    .investmentScore(91)
                    .rentalYield(4.5)
                    .builder(koltePatil)
                    .build();

            var s4 = com.realestate.twentyfourk.domain.society.Society.builder()
                    .name("Gera Joy on the Banks")
                    .slug("gera-joy-on-the-banks-wakad")
                    .location(PrimeCorridor.WAKAD)
                    .developer("Gera Developments")
                    .reraNumber("RERA-PUN-PRM-24K306")
                    .projectStatus("READY_TO_MOVE")
                    .startingPrice(new BigDecimal("8800000"))
                    .possessionDate("Immediate")
                    .overview("Premium child-centric homes on the river banks, with direct access to academies and coaching centers.")
                    .amenities("Riverview Deck, Child Academy, Olympic Swimming Coach, Tennis Court, Organic Garden")
                    .configuration("2 BHK, 3 BHK Duplex")
                    .googleMapsIframe("<iframe src=\"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.44444444444!2d73.7660!3d18.5970!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bef!2sWakad!5e0!3m2!1sen!2sin!4v1625118\" width=\"600\" height=\"450\" style=\"border:0;\" allowfullscreen=\"\" loading=\"lazy\"></iframe>")
                    .investmentScore(85)
                    .rentalYield(4.1)
                    .builder(gera)
                    .build();

            societyRepository.saveAll(List.of(s1, s2, s3, s4));
        }
    }
}
