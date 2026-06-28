package com.realestate.twentyfourk.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean(name = "whatsappAsyncExecutor")
    public Executor whatsappAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2); // Keep 2 threads active
        executor.setMaxPoolSize(10); // Scale up to 10 threads under load
        executor.setQueueCapacity(500); // Queue up to 500 tasks
        executor.setThreadNamePrefix("WhatsAppWebhook-");
        executor.initialize();
        return executor;
    }
}
