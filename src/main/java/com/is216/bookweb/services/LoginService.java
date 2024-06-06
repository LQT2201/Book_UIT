package com.is216.bookweb.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.is216.bookweb.models.User;
import com.is216.bookweb.repositories.UserRepository;
import com.is216.bookweb.services.imp.LoginServiceImp;
import java.util.List;

/**
 * LoginService
 */
@Service
public class LoginService implements LoginServiceImp{

    @Autowired
    UserRepository userRepository;

    public List<User> getAllUser(){
   
        return null;
    }

    public boolean checkLogin(String username, String password){
        
        List<User> listUser  =  userRepository.findByUsernameAndPassword(username, password);
        return listUser.size() > 0;
    }
    
}