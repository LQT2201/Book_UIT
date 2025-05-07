package com.is216.bookweb.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.is216.bookweb.models.Genre;
import com.is216.bookweb.payload.ResponseData;
import com.is216.bookweb.services.GenreService;

@RestController
@RequestMapping("api/genre")
public class GenreController {
    @Autowired
    GenreService genreService;

    @GetMapping()
    public ResponseEntity<?> findAllGenre() {
        ResponseData responseData = new ResponseData();
        try {
            List<Genre> genres = genreService.getAllGenres();
            responseData.setData(genres);
            responseData.setMessage("Lấy danh sách thể loại thành công");
            return ResponseEntity.ok(responseData);
        } catch (Exception e) {
            responseData.setSuccess(false);
            responseData.setMessage("Lỗi: " + e.getMessage());
            return ResponseEntity.badRequest().body(responseData);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findGenreById(@PathVariable String id) {
        ResponseData responseData = new ResponseData();
        try {
            List<Genre> genres = genreService.findGenreById(id);
            responseData.setData(genres);
            responseData.setMessage("Lấy thông tin thể loại thành công");
            return ResponseEntity.ok(responseData);
        } catch (Exception e) {
            responseData.setSuccess(false);
            responseData.setMessage("Lỗi: " + e.getMessage());
            return ResponseEntity.badRequest().body(responseData);
        }
    }

    @PostMapping()
    public ResponseEntity<?> createGenre(@RequestBody Genre genre) {
        ResponseData responseData = new ResponseData();
        try {
            String result = genreService.createGenre(genre);
            responseData.setData(result);
            responseData.setMessage("Thêm thể loại thành công");
            return ResponseEntity.ok(responseData);
        } catch (Exception e) {
            responseData.setSuccess(false);
            responseData.setMessage("Lỗi: " + e.getMessage());
            return ResponseEntity.badRequest().body(responseData);
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteGenre(@PathVariable String id) {
        ResponseData responseData = new ResponseData();
        try {
            String result = genreService.deleteGenre(id);
            responseData.setData(result);
            responseData.setMessage("Xóa thể loại thành công");
            return ResponseEntity.ok(responseData);
        } catch (Exception e) {
            responseData.setSuccess(false);
            responseData.setMessage("Lỗi: " + e.getMessage());
            return ResponseEntity.badRequest().body(responseData);
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateGenre(@PathVariable(name = "id") String id, @RequestBody Genre genre) {
        ResponseData responseData = new ResponseData();
        try {
            String result = genreService.updateGenre(id, genre);
            responseData.setData(result);
            responseData.setMessage("Cập nhật thể loại thành công");
            return ResponseEntity.ok(responseData);
        } catch (Exception e) {
            responseData.setSuccess(false);
            responseData.setMessage("Lỗi: " + e.getMessage());
            return ResponseEntity.badRequest().body(responseData);
        }
    }
}
