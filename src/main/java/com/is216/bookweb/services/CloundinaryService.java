package com.is216.bookweb.services;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;

@Service
public class CloundinaryService {
    
    @Autowired
    Cloudinary cloudinary;
    public String uploadFile(MultipartFile file){
        try {
            Map data = this.cloudinary.uploader().upload(file.getBytes(), Map.of());
            String imgUrl = (String)data.get("url");
            return imgUrl;
        } catch (Exception e) {
            throw new RuntimeException("Image upload fail");
        }
    }
}
