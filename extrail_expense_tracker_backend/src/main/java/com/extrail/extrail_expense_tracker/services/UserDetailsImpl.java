package com.extrail.extrail_expense_tracker.services;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.extrail.extrail_expense_tracker.dao.entity.RolesEntity;

public class UserDetailsImpl implements UserDetails {

    private final String name;
    private final String password;
    private final List<SimpleGrantedAuthority> allRoles;

    public UserDetailsImpl(String name, String password, List<RolesEntity> allRoles) {
        this.name = name;
        this.password = password;
        this.allRoles = allRoles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getRoleName()))
                .toList();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return allRoles;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return name;
    }

    // @Override
    // public boolean isAccountNonExpired() {
    //     return true;
    // }

    // @Override
    // public boolean isAccountNonLocked() {
    //     return true;
    // }

    // @Override
    // public boolean isCredentialsNonExpired() {
    //     return true;
    // }

    // @Override
    // public boolean isEnabled() {
    //     return true;
    // }
}
