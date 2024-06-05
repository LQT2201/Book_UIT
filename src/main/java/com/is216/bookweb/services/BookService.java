package com.is216.bookweb.services;

import java.math.BigDecimal;
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

    public Book getBookById(String id){
        return bookRepository.findById(id).get();
    }

    public boolean createBook(String title, String author, String genre, String description, Integer stock, BigDecimal price, BigDecimal salePrice) {
        boolean isSuccess = false;    
        try {
            Book book = new Book();
            book.setTitle(title);
            book.setAuthor(author);
            book.setDescription(description);
            book.setGenre(genre);
            book.setStock(stock);
            book.setPrice(price);
            book.setSalePrice(salePrice);

            bookRepository.save(book);
            isSuccess = true;

        } catch (Exception e) {
            System.out.println(e.getMessage());
            isSuccess = false;
        }
        return isSuccess;
    }

    public boolean deleteBook(String id){
        boolean isSuccess = false;
        try {
            bookRepository.deleteById(id);
            isSuccess = true;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            isSuccess = false;
        }
        return isSuccess;
    }

    public boolean updateBook(String id, Book bookDetail) {
        boolean isSuccess = false;    
        
        try {
           Book book =  bookRepository.findById(id).get();
           book.setTitle(bookDetail.getTitle());

           bookRepository.save(book);

           isSuccess = true;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            isSuccess = false;
        }
        return isSuccess;
    }
}
