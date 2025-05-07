package com.is216.bookweb.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.is216.bookweb.models.Book;
import com.is216.bookweb.models.BoughtInformation;
import com.is216.bookweb.models.Order;
import com.is216.bookweb.models.User;
import com.is216.bookweb.models.PasswordUpdateRequest;
import com.is216.bookweb.payload.ResponseData;
import com.is216.bookweb.repositories.BookRepository;
import com.is216.bookweb.repositories.UserRepository;
import com.is216.bookweb.services.OrderService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.security.crypto.password.PasswordEncoder;



@RestController
@RequestMapping("api/user")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    BookRepository bookRepository;
    
    @Autowired
    OrderService orderService;

    @Autowired
    PasswordEncoder passwordEncoder;

    @GetMapping()
    public ResponseEntity<?> getAllUser() {
        return new ResponseEntity<>(userRepository.findAll(), HttpStatus.OK);
    }
    
    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        try {
            var auth = SecurityContextHolder.getContext().getAuthentication();
            String username = (String)auth.getPrincipal();
            User user = userRepository.findByUsername(username);
            
            // Don't return the password
            user.setPassword(null);
            
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error fetching user profile: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/cart")
    public List<BoughtInformation> findCart() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        String username = (String)auth.getPrincipal();

        User user = userRepository.findByUsername(username);

        List<BoughtInformation> cart = user.getCart();

        return cart;
    } 
    
    /**
     * Get all orders for the currently authenticated user
     * 
     * @return ResponseEntity containing the user's orders
     */
    @GetMapping("/order")
    public ResponseEntity<?> getUserOrders() {
        try {
            // Get authenticated user
            var auth = SecurityContextHolder.getContext().getAuthentication();
            String username = (String)auth.getPrincipal();
            
            // Get orders for this user using the order service
            List<Order> userOrders = orderService.findOrdersByUsername(username);
            
            return new ResponseEntity<>(userOrders, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error fetching user orders: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
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
    
    @PostMapping("/profile/update")
    public ResponseEntity<?> updateProfile(@RequestBody User updatedUser) {
        try {
            var auth = SecurityContextHolder.getContext().getAuthentication();
            String username = (String)auth.getPrincipal();
            User user = userRepository.findByUsername(username);
            
            if (user == null) {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }

            // Update user information
            user.setFullName(updatedUser.getFullName());
            user.setEmail(updatedUser.getEmail());
            user.setPhoneNumber(updatedUser.getPhoneNumber());
            user.setAddress(updatedUser.getAddress());

            User savedUser = userRepository.save(user);
            savedUser.setPassword(null); // Don't return password
            
            return new ResponseEntity<>(savedUser, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating profile: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/profile/update-password")
    public ResponseEntity<?> updatePassword(@RequestBody PasswordUpdateRequest request) {
        try {
            var auth = SecurityContextHolder.getContext().getAuthentication();
            String username = (String)auth.getPrincipal();
            User user = userRepository.findByUsername(username);
            
            if (user == null) {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }

            // Update password
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);
            
            return new ResponseEntity<>("Password updated successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating password: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
