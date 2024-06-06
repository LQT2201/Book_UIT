package com.is216.bookweb.config;


import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class CloundinaryConfig {
    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dgtac4atn",
                "api_key", "872929158131621",
                "api_secret", "poamVo9dFCzdqSGXTPXOPXoCwYE",
                "secure", true
        ));
    }
    
}
