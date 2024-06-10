package com.is216.bookweb.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.is216.bookweb.config.CustomUserDetailsService;
import com.is216.bookweb.models.Book;
import com.is216.bookweb.models.BoughtInformation;
import com.is216.bookweb.models.User;
import com.is216.bookweb.payload.ResponseData;
import com.is216.bookweb.repositories.BookRepository;
import com.is216.bookweb.repositories.UserRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("api/user")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    BookRepository bookRepository;

    @GetMapping("/cart")
    public List<BoughtInformation> findCart() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        String username = (String)auth.getPrincipal();

        User user = userRepository.findByUsername(username);

        List<BoughtInformation> cart = user.getCart();

        return cart;
    } 

    @PostMapping("/cart")
    public ResponseEntity<?> updateCart(@RequestBody List<BoughtInformation> newCart) {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        String username = (String)auth.getPrincipal();
        ResponseData responseData = new ResponseData();
        User user = userRepository.findByUsername(username);
        try {
            for(var item : newCart) {
                Book book = bookRepository.findById(item.getItemId()).get();
                if(book.getStock() < item.getQuantity()) {
                    return new ResponseEntity<>(HttpStatusCode.valueOf(400));
                }
                item.setTitle(book.getTitle());
                item.setImage(book.getImages().get(0));
                item.setPrice(book.getPrice());
            }
            user.setCart(newCart);
            userRepository.save(user);
            responseData.setData(user.getCart());
            return new ResponseEntity<>(responseData,HttpStatusCode.valueOf(200));
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatusCode.valueOf(400));
        }
    }
    
}
