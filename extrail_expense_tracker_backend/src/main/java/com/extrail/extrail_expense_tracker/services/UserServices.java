package com.extrail.extrail_expense_tracker.services;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.extrail.extrail_expense_tracker.dao.RolesDao;
import com.extrail.extrail_expense_tracker.dao.UserDao;
import com.extrail.extrail_expense_tracker.dao.entity.RolesEntity;
import com.extrail.extrail_expense_tracker.dao.entity.UserEntity;
import com.extrail.extrail_expense_tracker.dto.UserDto;
import com.extrail.extrail_expense_tracker.dto.UserPasswordUpdateDto;
import com.extrail.extrail_expense_tracker.exception.EntityDeletedException;
import com.extrail.extrail_expense_tracker.exception.EntityNotFountException;
import com.extrail.extrail_expense_tracker.exception.InvalidActionException;
import com.extrail.extrail_expense_tracker.exception.UserNameNotFountException;
import com.extrail.extrail_expense_tracker.utils.BCryptUtil;
import com.extrail.extrail_expense_tracker.utils.Mapper;

import jakarta.transaction.Transactional;

@Service
public class UserServices {
    @Autowired
    UserDao userDao;

    @Autowired
    RolesDao rolesDao;

  public List<UserDto> getAllUsers() {
    return userDao.findAll().stream().map(Mapper::convertToUserDto).toList();
  }

  public List<UserDto> getExistingUsers() {
    return userDao.findAll().stream()
        .filter(user -> !user.isDeactivated())
        .map(Mapper::convertToUserDto).toList();
  }

  public UserDto getUser(Integer userId) {
    UserEntity user = userDao.findById(userId)
        .orElseThrow(() -> new EntityNotFountException(userId, "User"));
    if (user.isDeactivated()) throw new EntityDeletedException(userId, "User");
    return Mapper.convertToUserDto(user);
  }

  public UserDto getUserByUserName(String userName) {
    UserEntity user = userDao.findByUserName(userName)
        .orElseThrow(() -> new UserNameNotFountException(userName));
    if (user.isDeactivated()) throw new EntityDeletedException(userName, "User");
    return  Mapper.convertToUserDto(user);
  }

  @Transactional
public UserDto addUser(UserEntity newUser) {
  newUser.setPasswordHash(BCryptUtil.passwordHash(newUser.getPasswordHash()));

  // Ensure default USER exists
  RolesEntity userRole = rolesDao.findByRoleName("USER")
      .orElseGet(() -> {
        RolesEntity r = new RolesEntity();
        r.setRoleName("USER");
        return rolesDao.save(r);
      });

  // Normalize incoming roles (optional but good)
  List<RolesEntity> incoming = newUser.getRoles();
  if (incoming == null || incoming.isEmpty()) {
    // If no roles provided → assign USER only
    newUser.setRoles(new ArrayList<>(List.of(userRole)));
  } else {
    // Resolve to DB roles, case-insensitive; avoid duplicates
    Map<String, RolesEntity> resolved = new LinkedHashMap<>();
    for (RolesEntity r : incoming) {
      String name = r.getRoleName() == null ? "" : r.getRoleName().trim();
      if (name.isEmpty()) continue;
      String key = name.toUpperCase();
      RolesEntity dbRole = rolesDao.findByRoleName(key)
          .orElseGet(() -> {
            RolesEntity nr = new RolesEntity();
            nr.setRoleName(key);
            return rolesDao.save(nr);
          });
      resolved.putIfAbsent(key, dbRole);
    }
    newUser.setRoles(new ArrayList<>(resolved.values()));
  }

  return Mapper.convertToUserDto(userDao.saveAndFlush(newUser));
}


  @Transactional
  public UserDto updateUser(UserEntity editUser) {
    // trusts id in payload; in real app you’d fetch and copy allowed fields
    return Mapper.convertToUserDto(userDao.saveAndFlush(editUser));
  }

  @Transactional
  public void deleteUser(Integer userId) { // soft delete
    UserEntity user = userDao.findById(userId)
        .orElseThrow(() -> new EntityNotFountException(userId, "User"));
    user.setDeactivated(true);
    userDao.save(user);
  }

  @Transactional
  public UserDto updatePassword(UserPasswordUpdateDto req) {
    UserEntity u = userDao.findById(req.getUserId())
        .orElseThrow(() -> new EntityNotFountException(req.getUserId(), "User"));
    if (!BCryptUtil.verifyPassword(req.getOldPassword(), u.getPasswordHash())) {
      throw new InvalidActionException("Invalid current password");
    }
    u.setPasswordHash(BCryptUtil.passwordHash(req.getNewPassword()));
    userDao.saveAndFlush(u);
    return Mapper.convertToUserDto(u);
  }

  // public Optional<UserEntity> authenticate(UserAthuDto login) {
  //   return userDao.findByUserName(login.getUserName())
  //       .filter(u -> BCryptUtil.verifyPassword(login.getPasswordHash(), u.getPasswordHash()));
  // }

  public List<UserDto> getUserByRole(String roleName) {
    List<UserEntity> users = userDao.findByRoleName(roleName);
    if (users.isEmpty()) {
        throw new EntityNotFountException(roleName, "Role");
    }
    return users.stream().map(Mapper::convertToUserDto).toList();
  }


//   private UserDto toDto(UserEntity e) {
//     UserDto dto = new UserDto();
//     dto.setUserId(e.getUserId());
//     dto.setUserName(e.getUserName());
//     dto.setEmail(e.getEmail());
//     dto.setPhone(e.getPhone());
//     dto.setRoles(e.getRoles().stream().toList());
//     dto.setDeactivated(e.isDeactivated());
//     dto.setCreatedAt(e.getCreatedAt());
//     return dto;
//   }
}



