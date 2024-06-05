
package com.is216.bookweb.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.is216.bookweb.payload.ResponseData;
import com.is216.bookweb.services.imp.LoginServiceImp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;





@RestController
@RequestMapping("api/login")
public class LoginController {

    @Autowired
    LoginServiceImp loginServiceImp;

    @PostMapping("/singin")
    public ResponseEntity<?> singin(@RequestParam String username, @RequestParam String password) {
        ResponseData responseData = new ResponseData();
        if (loginServiceImp.checkLogin(username, password)) {
            responseData.setData(true);
        } else {
            responseData.setData(false);
        }
        
        return new ResponseEntity<>(responseData,HttpStatus.OK);
    }
    
}