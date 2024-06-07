package com.is216.bookweb.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.is216.bookweb.models.Genre;
import com.is216.bookweb.services.GenreService;





@RestController
@RequestMapping("api/genre")
public class GenreController {
    @Autowired
    GenreService genreService;

    @GetMapping()
    public List<Genre> findAllGenre() {
        
        return genreService.getAllGenres();
    }

    @GetMapping("/{id}")
    public List<Genre> findGenreById(@PathVariable String id) {
        return genreService.findGenreById(id);
    }


    @PostMapping()
    public String createGenre(@RequestBody Genre genre) {
        return genreService.createGenre(genre);
    }

   @DeleteMapping("/delete/{id}")
   public String deleteGenre(@PathVariable String id) {
        return genreService.deleteGenre(id);
   }

   @PatchMapping("/{id}")
   public String updateGenre(@PathVariable(name = "id") String id, @RequestBody Genre genre) {
        return genreService.updateGenre(id, genre);
   }

}
