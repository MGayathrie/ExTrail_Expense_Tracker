package com.extrail.extrail_expense_tracker.utils;

import org.springframework.beans.BeanUtils;

import com.extrail.extrail_expense_tracker.dao.entity.UserEntity;
import com.extrail.extrail_expense_tracker.dto.UserDto;

public class Mapper {
    private Mapper() {
        throw new IllegalArgumentException();
    }

    public static UserDto convertToUserDto(UserEntity user) {
        UserDto userDto = new UserDto();
        BeanUtils.copyProperties(user, userDto);
        userDto.setRoles(user.getRoles());
        return userDto;
    }

    public static UserEntity convertToUserDto(UserDto user) {
        UserEntity userEntity = new UserEntity();
        BeanUtils.copyProperties(user, userEntity);
        userEntity.setRoles(user.getRoles());
        return userEntity;
    }
}
