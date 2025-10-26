package com.extrail.extrail_expense_tracker.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.extrail.extrail_expense_tracker.dao.UserDao;
import com.extrail.extrail_expense_tracker.dao.entity.UserEntity;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    UserDao userDao;

    @Override
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
        Optional<UserEntity> userEntity = userDao.findByUserName(userName);
        return userEntity
                .map(userInfo -> new UserDetailsImpl(userInfo.getUserName(), userInfo.getPasswordHash(), userInfo.getRoles()))
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userName));
    }
}
