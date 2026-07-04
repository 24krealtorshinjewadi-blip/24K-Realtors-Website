package com.realestate.twentyfourk.domain.agent.service;

import com.realestate.twentyfourk.domain.agent.Agent;
import com.realestate.twentyfourk.domain.agent.AgentRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
public class LeadRoutingService {

    private static final Logger log = LoggerFactory.getLogger(LeadRoutingService.class);
    
    private final AgentRepository agentRepository;
    private final AtomicInteger counter = new AtomicInteger(0);

    /**
     * Thread-safe retrieval of the next active agent for round-robin lead allocation.
     * @return Assigned Agent or null if no active agents are available.
     */
    public synchronized Agent getNextAgentForAssignment() {
        List<Agent> activeAgents = agentRepository.findByActiveTrue();
        
        if (activeAgents.isEmpty()) {
            log.warn("No active agents found in the system. Lead will remain unassigned.");
            return null;
        }

        // Circular index calculation
        int index = counter.getAndIncrement() % activeAgents.size();
        
        // Prevent negative values in case of integer overflow wrap-around
        if (index < 0) {
            counter.set(0);
            index = 0;
        }

        Agent assignedAgent = activeAgents.get(index);
        log.info("Lead Routing: Assigned lead to Agent: {} (ID: {})", assignedAgent.getName(), assignedAgent.getId());
        
        return assignedAgent;
    }
}
