package com.is216.bookweb.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.is216.bookweb.models.Book;
import com.is216.bookweb.repositories.BookRepository;

@Service
public class BookService {
    @Autowired
    private BookRepository bookRepository;

    public List<Book> getAllBooks() {
        System.out.println("connect");
        return bookRepository.findAll();
    }
}
