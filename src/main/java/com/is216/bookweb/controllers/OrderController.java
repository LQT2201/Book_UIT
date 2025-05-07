package com.is216.bookweb.controllers;



import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<?> findAllOrder() {
        try {
            List<Order> orders = orderService.getAllOrders();
            ResponseData responseData = new ResponseData();
            responseData.setData(orders);
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error fetching orders: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findOrderById(@PathVariable String id) {
        try {
            List<Order> orders = orderService.findOrderById(id);
            if (orders.isEmpty()) {
                return new ResponseEntity<>("Order not found", HttpStatus.NOT_FOUND);
            }
            ResponseData responseData = new ResponseData();
            responseData.setData(orders.get(0));
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error fetching order: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Get all orders for the currently authenticated user
     * 
     * @return List of orders for the current user
     */
    @GetMapping("/user")
    public ResponseEntity<?> findOrdersByCurrentUser() {
        try {
            // Get the authenticated username from security context
            var auth = SecurityContextHolder.getContext().getAuthentication();
            String username = (String)auth.getPrincipal();
            
            // Get orders for this user
            List<Order> userOrders = orderService.findOrdersByUsername(username);
            
            // Return the orders with appropriate response
            ResponseData responseData = new ResponseData();
            responseData.setData(userOrders);
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error fetching orders: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Get all orders for a specific user (admin function)
     * 
     * @param username The username to fetch orders for
     * @return List of orders for the specified user
     */
    @GetMapping("/user/{username}")
    public ResponseEntity<?> findOrdersByUsername(@PathVariable String username) {
        try {
            // Get orders for this username
            List<Order> userOrders = orderService.findOrdersByUsername(username);
            
            // Return the orders with appropriate response
            ResponseData responseData = new ResponseData();
            responseData.setData(userOrders);
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error fetching orders: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping()
    public Order createGenre(@RequestBody Order order) {
        return orderService.createOrder(order);
    }

    @DeleteMapping("/delete/{id}")
    public String deleteOrder(@PathVariable String id) {
        return orderService.deleteOrder(id);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateOrder(@PathVariable("id") String id, @RequestBody String status) {
        try {
            String result = orderService.updateOrder(id, status);
            ResponseData responseData = new ResponseData();
            responseData.setData(result);
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating order: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/checkout/vn-pay")
    public String createVnpapOrder(@RequestBody String entity) {
        
        
        return entity;
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
                // Cập nhật tồn kho và đã bán
                book.setStock(book.getStock() - item.getQuantity());
                book.setSoldQty(book.getSoldQty() + item.getQuantity());
                bookRepository.save(book);

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
