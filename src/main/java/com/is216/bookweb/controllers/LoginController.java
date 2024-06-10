
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

     public ResponseEntity<?> signup(@RequestBody User user) {
        if (userRepository.findByUsername(user.getUsername()) != null) {
            return new ResponseEntity<>(HttpStatusCode.valueOf(400));
        }
        User registerUser = new User();
        registerUser.setUsername(user.getUsername());
        registerUser.setPassword(passwordEncoder.encode(user.getPassword()));
        registerUser.setRole("ROLE_USER");
        User savedUser = userRepository.save(registerUser);

        if (savedUser == null) {
            return new ResponseEntity<>(HttpStatusCode.valueOf(500));
        }

        return new ResponseEntity<>( HttpStatusCode.valueOf(200));
    }
    
    
}