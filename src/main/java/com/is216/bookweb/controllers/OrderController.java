package com.is216.bookweb.controllers;



import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.is216.bookweb.models.Book;
import com.is216.bookweb.models.Order;
import com.is216.bookweb.models.User;
import com.is216.bookweb.payload.ResponseData;
import com.is216.bookweb.repositories.BookRepository;
import com.is216.bookweb.repositories.OrderRepository;
import com.is216.bookweb.repositories.UserRepository;
import com.is216.bookweb.services.OrderService;




@RestController
@RequestMapping("api/order")

public class OrderController {
    @Autowired
    OrderService orderService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    BookRepository bookRepository;

    @Autowired
    OrderRepository orderRepository;

    @GetMapping()
    public  List<Order> findAllOrder() {
        return orderService.getAllOrders();
    }

    @GetMapping("/{id}")
    public List<Order> findOrderById(@PathVariable String id) {
        return orderService.findOrderById(id);
    }

    @PostMapping()
    public String createGenre(@RequestBody Order order) {
        return orderService.createOrder(order);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteOrder(@PathVariable String id) {
        return orderService.deleteOrder(id);
    }

    @PatchMapping("/{id}")
    public String updateOrder(@PathVariable("id") String id, @RequestBody String status) {
        return orderService.updateOrder(id, status);
    }

    @PostMapping("/checkout")
    public ResponseEntity<?> createOrder(@RequestBody String shippingAddress) {
        
        try {

            var auth = SecurityContextHolder.getContext().getAuthentication();
            String username = (String)auth.getPrincipal();
            User user = userRepository.findByUsername(username);

            var cart = user.getCart();
            ResponseData responseData = new ResponseData();
            if(cart == null || cart.isEmpty()) {
                responseData.setData("Giỏ hàng trống");
                return new ResponseEntity<>(responseData, HttpStatusCode.valueOf(400));
            }
            
            Order order = new Order(user.getUsername(), cart, shippingAddress);
            for (var item : cart) {
                Book book = bookRepository.findById(item.getItemId()).get();
                if (book.getStock() < item.getQuantity()) {
                    return new ResponseEntity<>(HttpStatusCode.valueOf(400));
                }
                var price = book.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                order.setTotalPrice(order.getTotalPrice().add(price));
            }

            var savedOrder = orderRepository.save(order);
            cart.clear();
            user.setCart(cart);
            userRepository.save(user);
            responseData.setData(savedOrder);
            return new ResponseEntity<>(responseData, HttpStatusCode.valueOf(200));
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatusCode.valueOf(400));
        }
        
       
    }
    

}
