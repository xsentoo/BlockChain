package com.uphf.blockchain.Service;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class AuthService {

    private List<String> tokensActifs = new ArrayList<>();

    private final String ADMIN_USER = "admin";
    private final String ADMIN_PASS = "azerty";

    public String login(String username, String password) {
        if (ADMIN_USER.equals(username) && ADMIN_PASS.equals(password)) {
            String token = UUID.randomUUID().toString();
            tokensActifs.add(token);
            return token;
        }
        return null;
    }

    public boolean isTokenValide(String token) {
        return tokensActifs.contains(token);
    }

    public void logout(String token) {
        tokensActifs.remove(token);
    }
}