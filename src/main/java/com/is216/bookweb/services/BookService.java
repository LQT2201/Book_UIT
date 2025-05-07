package com.is216.bookweb.services;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.ArrayList;

import com.is216.bookweb.models.Book;
import com.is216.bookweb.models.Genre;
import com.is216.bookweb.repositories.BookRepository;

@Service
public class BookService {
    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private CloundinaryService cloundinaryService;

    @Autowired
    private GenreService genreService;

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
            String genreId, 
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

            Genre genre = genreService.getGenreById(genreId);
            if (genre == null) {
                return false;
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
            String genreId, 
            String description, 
            Integer stock, 
            BigDecimal price, 
            BigDecimal salePrice,
            String publisher,
            List<MultipartFile> images) {
        boolean isSuccess = false;    
        
        try {
            Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sách với ID: " + id));
            
            Genre genre = genreService.getGenreById(genreId);
            if (genre == null) {
                throw new RuntimeException("Không tìm thấy thể loại với ID: " + genreId);
            }
            
            // Update book information
            book.setTitle(title);
            book.setAuthor(author);
            book.setDescription(description);
            book.setGenre(genre);
            book.setPrice(price);
            book.setSalePrice(salePrice);
            book.setStock(stock);
            book.setPublisher(publisher);

            // Handle images
            if (images != null && !images.isEmpty()) {
                List<String> imgUrls = new ArrayList<>();
                for (MultipartFile img : images) {
                    if (!img.isEmpty()) {
                        imgUrls.add(cloundinaryService.uploadFile(img));
                    }
                }
                if (!imgUrls.isEmpty()) {
                    book.setImages(imgUrls);
                }
            }

            bookRepository.save(book);
            isSuccess = true;
        } catch (Exception e) {
            System.out.println("Error updating book: " + e.getMessage());
            e.printStackTrace();
            isSuccess = false;
        }
        return isSuccess;
    }

    public List<Book> searchBooks(String keyword, List<String> genres, String sort, String by) {
        List<Book> filteredBooks = getAllBooks();

        // Apply keyword filter
        if (keyword != null && !keyword.trim().isEmpty()) {
            String searchTerm = keyword.toLowerCase().trim();
            filteredBooks = filteredBooks.stream()
                .filter(book -> 
                    (book.getTitle() != null && book.getTitle().toLowerCase().contains(searchTerm)) ||
                    (book.getAuthor() != null && book.getAuthor().toLowerCase().contains(searchTerm)) ||
                    (book.getGenre() != null && book.getGenre().getName() != null && 
                     book.getGenre().getName().toLowerCase().contains(searchTerm)) ||
                    (book.getDescription() != null && book.getDescription().toLowerCase().contains(searchTerm))
                )
                .collect(Collectors.toList());
        }

        // Apply genre filter
        if (genres != null && !genres.isEmpty()) {
            filteredBooks = filteredBooks.stream()
                .filter(book -> book.getGenre() != null && 
                              genres.contains(book.getGenre().getName()))
                .collect(Collectors.toList());
        }

        // Apply sorting
        if (sort != null && by != null) {
            filteredBooks.sort((b1, b2) -> {
                int comparison = 0;
                switch (by.toLowerCase()) {
                    case "price":
                        comparison = b1.getPrice().compareTo(b2.getPrice());
                        break;
                    case "publishdate":
                        comparison = b1.getId().compareTo(b2.getId());
                        break;
                    case "title":
                        comparison = b1.getTitle().compareToIgnoreCase(b2.getTitle());
                        break;
                    default:
                        return 0;
                }
                return sort.equalsIgnoreCase("ASC") ? comparison : -comparison;
            });
        }

        return filteredBooks;
    }
}
