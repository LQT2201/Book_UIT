package com.is216.bookweb.services.imp;
import java.util.List;

import com.is216.bookweb.models.User;


public interface LoginServiceImp {
    List<User> getAllUser();
    boolean checkLogin(String username, String password);
}
