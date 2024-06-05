package com.is216.bookweb.services;


import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import com.is216.bookweb.models.Genre;
import com.is216.bookweb.repositories.GenreRepository;


@Service
public class GenreService {
    @Autowired
    private GenreRepository genreRepository;

    public List<Genre> getAllGenres() {
        System.out.println("connect");
        return genreRepository.findAll();
    }

    public String createGenre(Genre genre) {
        try {
            genreRepository.save(genre);
            return "Add success";
        } 
        catch (Exception e) {
            return "Fail!";
        }
    }

    public String deleteGenre(String id) {
        try{
            genreRepository.deleteById(id);
            return "Delete Success!";
        }
        catch( Exception e) {
            return "Fail!";
        }
        
    }

    public String updateGenre(@PathVariable(name = "id") String id, Genre newGenre) {
        Genre genre = genreRepository.findById(id).get();
        genre.setName(newGenre.getName());
        genre.setDescription(newGenre.getDescription());
        genreRepository.save(genre);

        return "Update success!";
    }

    

    
}
