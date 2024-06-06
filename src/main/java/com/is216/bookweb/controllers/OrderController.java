package com.is216.bookweb.controllers;



import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.is216.bookweb.models.Order;
import com.is216.bookweb.services.OrderService;




@RestController
@RequestMapping("api/order")

public class OrderController {
    @Autowired
    OrderService orderService;

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
    public String updateOrder(@PathVariable(name = "id") String id, @RequestBody Order order) {
        return orderService.updateOrder(id, order);
    }

}
