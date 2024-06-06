package com.is216.bookweb.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.is216.bookweb.services.CloundinaryService;

@RestController
@RequestMapping("/upload")
public class CloundinaryController {
    @Autowired
    CloundinaryService  cloundinaryService;

    @PostMapping()
    public ResponseEntity<?> uploadFile(@RequestParam("image")MultipartFile file){
        
        String imgUrl = cloundinaryService.uploadFile(file);
        return new ResponseEntity<>(imgUrl,HttpStatus.OK);
        
    }  
}
