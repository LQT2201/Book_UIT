package com.is216.bookweb.controllers;

import com.is216.bookweb.models.Order;
import com.is216.bookweb.payload.ResponseData;
import com.is216.bookweb.repositories.OrderRepository;
import com.is216.bookweb.services.OrderService;
import com.is216.bookweb.services.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {
    
    @Autowired
    PaymentService paymentService;

    @Autowired
    OrderService orderService;

    @Autowired
    OrderRepository orderRepository;

    String id;

    @GetMapping("/vn-pay")
    public ResponseEntity<?> pay(HttpServletRequest request,@RequestBody Order order) {
        Order newOrder = orderService.createOrder(order);
        id = newOrder.getId();
        
        return new ResponseEntity<>(paymentService.createVnPayPayment(request), HttpStatus.OK);
    }

    @GetMapping("/vn-pay-callback")
    public ResponseEntity<ResponseData> payCallbackHandler(HttpServletRequest request) {
        String status = request.getParameter("vnp_ResponseCode");
        ResponseData responseData = new ResponseData();

        Order vnpayOrder = orderRepository.findById(id).get();
        vnpayOrder.setOrderStatus("Da thanh toan online");
        orderRepository.save(vnpayOrder);

        if (status.equals("00")) {
            responseData.setSuccess(true);
            responseData.setData("Thanh cong");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        }
        responseData.setData("failed");
        return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
    }
    
}
