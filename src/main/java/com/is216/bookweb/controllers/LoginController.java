package com.is216.bookweb.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.is216.bookweb.models.User;
import com.is216.bookweb.payload.ResponseData;
import com.is216.bookweb.repositories.UserRepository;
import com.is216.bookweb.services.imp.LoginServiceImp;
import com.is216.bookweb.utils.JwtHelper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.ArrayList;


@RestController
@RequestMapping("/login")
public class LoginController {

    @Autowired
    LoginServiceImp loginServiceImp;

    @Autowired
    JwtHelper jwtHelper;
    
    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @PostMapping("/signin")
    public ResponseEntity<?> singin(@RequestParam String username, @RequestParam String password) {
        ResponseData responseData = new ResponseData();

        if (loginServiceImp.checkLogin(username, password)) {
            String token = jwtHelper.generateToken(username);
            responseData.setSuccess(true);
            responseData.setData(token);
            
        } else {
            responseData.setSuccess(false);
            responseData.setData("Dang nhap that bai");
        }
        
        return new ResponseEntity<>(responseData,HttpStatus.OK);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()) != null) {
            return new ResponseEntity<>("Username already exists", HttpStatus.BAD_REQUEST);
        }

        User registerUser = new User();
        registerUser.setUsername(user.getUsername());
        registerUser.setPassword(passwordEncoder.encode(user.getPassword()));
        registerUser.setRole("ROLE_USER");
        registerUser.setFullName(user.getFullName());
        registerUser.setEmail(user.getEmail());
        registerUser.setPhoneNumber(user.getPhoneNumber());
        registerUser.setAddress(user.getAddress());
        registerUser.setCart(new ArrayList<>());

        try {
            User savedUser = userRepository.save(registerUser);
            if (savedUser == null) {
                return new ResponseEntity<>("Failed to create user", HttpStatus.INTERNAL_SERVER_ERROR);
            }
            return new ResponseEntity<>("User registered successfully", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error creating user: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    
}