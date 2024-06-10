package com.is216.bookweb.services;


import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.is216.bookweb.config.VnpayConfig;
import com.is216.bookweb.payload.PaymentDTO;
import com.is216.bookweb.utils.VnpayUtil
;

import java.util.*;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final VnpayConfig vnPayConfig;

    public PaymentDTO.VNPayResponse createVnPayPayment(HttpServletRequest request) {
        long amount = Integer.parseInt(request.getParameter("amount")) * 100L;
        String bankCode = request.getParameter("bankCode");
        Map<String, String> vnpParamsMap = vnPayConfig.getVNPayConfig();
        vnpParamsMap.put("vnp_Amount", String.valueOf(amount));
        if (bankCode != null && !bankCode.isEmpty()) {
            vnpParamsMap.put("vnp_BankCode", bankCode);
        }
        vnpParamsMap.put("vnp_IpAddr", VnpayUtil
        .getIpAddress(request));
                //build query url
                String queryUrl = VnpayUtil
        .getPaymentURL(vnpParamsMap, true);
                String hashData = VnpayUtil
        .getPaymentURL(vnpParamsMap, false);
                String vnpSecureHash = VnpayUtil
        .hmacSHA512(vnPayConfig.getSecretKey(), hashData);
                queryUrl += "&vnp_SecureHash=" + vnpSecureHash;
                String paymentUrl = vnPayConfig.getVnp_PayUrl() + "?" + queryUrl;
                return PaymentDTO.VNPayResponse.builder()
                        .code("ok")
                        .message("success")
                .paymentUrl(paymentUrl).build();
    }
}
