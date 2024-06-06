package com.is216.bookweb.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.is216.bookweb.models.Order;
import com.is216.bookweb.repositories.OrderRepository;


@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    
    public String createOrder(Order order) {
        try{
            orderRepository.save(order);
            return "Add success";
        }
        catch (Exception e) {
            return "Fail";
        }
    }


    public String deleteOrder(String id) {
        try{
            orderRepository.deleteById(id);
            return "Delete Success!";
        }
        catch( Exception e) {
            return "Fail!";
        }
    }


    public String updateOrder(String id, Order newOrder) {
       Order order = orderRepository.findById(id).get();
       order.setUsername(newOrder.getUsername());
       order.setTotalPrice(newOrder.getTotalPrice());
       order.setOrderStatus(newOrder.getOrderStatus());
       order.setOrderItems(newOrder.getOrderItems());
       order.setShippingAddress(newOrder.getShippingAddress());

       orderRepository.save(order);

        return "Update success";
    }


    public List<Order> findOrderById(String id) {
        List<Order> orders = new ArrayList<>();
        var order = orderRepository.findById(id).get();
        orders.add(order);

        return orders;
    }   
    
}

    
