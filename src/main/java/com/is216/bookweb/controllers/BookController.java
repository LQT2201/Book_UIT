package com.is216.bookweb.controllers;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.is216.bookweb.models.Book;
import com.is216.bookweb.models.BookUpdateRequest;
import com.is216.bookweb.payload.ResponseData;
import com.is216.bookweb.services.BookService;






@RestController
@RequestMapping("/api/book")
public class BookController {
    @Autowired
    private BookService bookService;

    @GetMapping
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchBooks(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "genre", required = false) List<String> genres,
            @RequestParam(value = "sort", required = false) String sort,
            @RequestParam(value = "by", required = false) String by) {
        try {
            List<Book> books = bookService.searchBooks(keyword, genres, sort, by);
            return new ResponseEntity<>(books, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getBookById(@PathVariable("id") String id) {

        try {
            Book book = bookService.getBookById(id);
            return new ResponseEntity<>(book, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(),HttpStatus.NOT_FOUND);
        }
        
    }
    
    @PostMapping()
    public ResponseEntity<?> createBook(
            @RequestParam(value = "title", required = true)  String title,
            @RequestParam("author")  String author,
            @RequestParam("genre")  String genre,
            @RequestParam("description")  String description,
            @RequestParam("stock")  Integer stock,
            @RequestParam("price")  BigDecimal price,
            @RequestParam("salePrice")  BigDecimal salePrice,
            @RequestParam("publisher")  String publisher,
            @RequestParam(value = "images", required = false) List<MultipartFile> images ) {
        
        ResponseData responseData = new ResponseData();
        boolean success = bookService.createBook(title, author, genre, description, stock, price, salePrice, publisher,images);
        responseData.setData(success);
        
        return new ResponseEntity<>(responseData,HttpStatus.OK );
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable("id") String id){
        ResponseData responseData =  new ResponseData();
        responseData.setData(bookService.deleteBook(id));

        return new ResponseEntity<>(responseData, HttpStatus.OK);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateBook(
        @PathVariable("id") String id,
        @RequestParam(value = "title", required = true) String title,
        @RequestParam(value = "author", required = true) String author,
        @RequestParam(value = "genre", required = true) String genre,
        @RequestParam(value = "description", required = true) String description,
        @RequestParam(value = "stock", required = true) Integer stock,
        @RequestParam(value = "price", required = true) BigDecimal price,
        @RequestParam(value = "salePrice", required = true) BigDecimal salePrice,
        @RequestParam(value = "publisher", required = true) String publisher,
        @RequestParam(value = "images", required = false) List<MultipartFile> images) {
        
        ResponseData responseData = new ResponseData();
        try {
            boolean success = bookService.updateBook(id, title, author, genre, description, stock, price, salePrice, publisher, images);
            if (success) {
                responseData.setData(true);
                responseData.setMessage("Cập nhật sách thành công");
                return new ResponseEntity<>(responseData, HttpStatus.OK);
            } else {
                responseData.setData(false);
                responseData.setMessage("Cập nhật sách thất bại");
                return new ResponseEntity<>(responseData, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            responseData.setData(false);
            responseData.setMessage("Lỗi: " + e.getMessage());
            return new ResponseEntity<>(responseData, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
