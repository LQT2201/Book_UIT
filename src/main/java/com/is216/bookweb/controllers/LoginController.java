
package com.is216.bookweb.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.is216.bookweb.payload.ResponseData;
import com.is216.bookweb.services.imp.LoginServiceImp;
import com.is216.bookweb.utils.JwtHelper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/login")
public class LoginController {

    @Autowired
    LoginServiceImp loginServiceImp;

    @Autowired
    JwtHelper jwtHelper;

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
    
}