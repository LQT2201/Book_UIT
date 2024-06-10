package com.is216.bookweb.services;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.ArrayList;

import com.is216.bookweb.models.Book;
import com.is216.bookweb.repositories.BookRepository;

@Service
public class BookService {
    @Autowired
    private BookRepository bookRepository;

    @Autowired
    CloundinaryService cloundinaryService;

    public List<Book> getAllBooks() {
        System.out.println("Get all book");
        return bookRepository.findAll();
    }

    public Book getBookById(String id){
        return bookRepository.findById(id).get();
    }

    public boolean createBook(
            String title, 
            String author, 
            String genre, 
            String description, 
            Integer stock, 
            BigDecimal price, 
            BigDecimal salePrice,
            String publisher,
            List<MultipartFile> images) {

        boolean isSuccess = false;    

        try {
            Book book = new Book();
            List<String> imgUrls = new ArrayList<>();

            // Up list ảnh lên cloundinary
            if (images!=null) {
                for (MultipartFile img : images) {
                    imgUrls.add( cloundinaryService.uploadFile(img));
                }
            }

            book.setTitle(title);
            book.setAuthor(author);
            book.setDescription(description);
            book.setGenre(genre);
            book.setStock(stock);
            book.setPrice(price);
            book.setSalePrice(salePrice);
            book.setPublisher(publisher);
            book.setImages(imgUrls);

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

    public boolean updateBook(
            String id, 
            String title, 
            String author, 
            String genre, 
            String description, 
            Integer stock, 
            BigDecimal price, 
            BigDecimal salePrice,
            String publisher,
            List<MultipartFile> images) {
        boolean isSuccess = false;    
        List<String> imgUrls = new ArrayList<>();
        
        try {
           Book book =  bookRepository.findById(id).get();
           book.setTitle(title);
           book.setAuthor(author);
           book.setDescription(description);
           book.setGenre(genre);
           book.setPrice(price);
           book.setSalePrice(salePrice);
           book.setStock(stock);
           book.setPublisher(publisher);

           if (images != null) {
            for (MultipartFile img : images) {
                imgUrls.add(cloundinaryService.uploadFile(img));
            }
           }
           
           book.setImages(imgUrls);
           bookRepository.save(book);
           isSuccess = true;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            isSuccess = false;
        }
        return isSuccess;
    }
}
