package com.is216.bookweb.controllers;

import com.is216.bookweb.payload.ResponseData;
import com.is216.bookweb.services.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {
    
    @Autowired
    PaymentService paymentService;

    @GetMapping("/vn-pay")
    public ResponseEntity<?> pay(HttpServletRequest request) {
        ResponseData responseData = new ResponseData();

        responseData.setStatus(200);
        responseData.setData(paymentService.createVnPayPayment(request));
        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @GetMapping("/vn-pay-callback")
    public ResponseEntity<ResponseData> payCallbackHandler(HttpServletRequest request) {
        String status = request.getParameter("vnp_ResponseCode");
        ResponseData responseData = new ResponseData();

        if (status.equals("00")) {
            responseData.setSuccess(true);
            responseData.setData("Thanh cong");
            return new ResponseEntity<>(responseData, HttpStatus.OK);
        }
        responseData.setData("failed");
        return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
    }
    
}
