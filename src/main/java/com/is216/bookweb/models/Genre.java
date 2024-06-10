package com.is216.bookweb.models;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "genres")
public class Genre {
    @Id
    private String id;
    private String name;
    private String description;
    private String images;
    public Genre() { 
        
    }
    public String getId() {
        return id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public String getImages() {
        return images;
    }
    public void setImages(String images) {
        this.images = images;
    }


}
