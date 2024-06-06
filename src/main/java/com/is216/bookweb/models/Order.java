package com.is216.bookweb.models;


import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;

@Document(collection = "orders")
public class Order {
    @Id
    String id;
    String username;
    @Field(targetType = FieldType.DECIMAL128)
    BigDecimal totalPrice;
    String orderStatus;
    List<BoughtInformation> orderItems;
    String shippingAddress;

    public Order() {
        this.totalPrice = new BigDecimal(0);

        this.orderStatus = "Đang xử lý";
    }
    public Order(String username, List<BoughtInformation> cart, String shippingAddress) {
        this.totalPrice = new BigDecimal(0);
        this.orderStatus = "Đang xử lý";
        this.username = username;
        this.orderItems = cart;
        this.shippingAddress = shippingAddress;
    }
    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }

    public List<BoughtInformation> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<BoughtInformation> orderItems) {
        this.orderItems = orderItems;
    }
}