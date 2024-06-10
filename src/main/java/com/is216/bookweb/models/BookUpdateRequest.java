package com.is216.bookweb.models;

import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public class BookUpdateRequest {
    private Book bookDetail;
    private List<MultipartFile> images;
    public Book getBookDetail() {
        return bookDetail;
    }
    public List<MultipartFile> getImages() {
        return images;
    } 

    // Getters and setters
}
