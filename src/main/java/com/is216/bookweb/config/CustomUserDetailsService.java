package com.is216.bookweb.config;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.is216.bookweb.models.User;
import com.is216.bookweb.repositories.UserRepository;


@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    UserRepository userRepository;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println(username);
        User user = userRepository.findByUsername("luong");
        System.out.println("user"+ userRepository.findByUsername(username));
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }
        System.out.println("da vao day");
        return new org.springframework.security.core.userdetails.User(username,
        user.getPassword(),
        new ArrayList<>());
    }
}
