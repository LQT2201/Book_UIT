package com.is216.bookweb.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.is216.bookweb.models.Order;

@Repository
public interface  OrderRepository extends MongoRepository<Order, String> {
        
}
