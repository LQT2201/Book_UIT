package com.is216.bookweb.controllers;

import org.springframework.web.bind.annotation.RestController;

import com.is216.bookweb.models.Book;
import com.is216.bookweb.services.BookService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
@RequestMapping("/api/test")
public class BookController {
    @Autowired
    private BookService bookService;

    @GetMapping
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }
    
    
}
