package com.extrail.extrail_expense_tracker.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.extrail.extrail_expense_tracker.dao.RolesDao;
import com.extrail.extrail_expense_tracker.dao.UserDao;
import com.extrail.extrail_expense_tracker.dao.entity.RolesEntity;
import com.extrail.extrail_expense_tracker.dao.entity.UserEntity;
import com.extrail.extrail_expense_tracker.exception.EntityNotFountException;
import com.extrail.extrail_expense_tracker.exception.InvalidActionException;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RolesServices {

    @Autowired
    RolesDao rolesDao;

    @Autowired
    UserDao userDao;

    @Transactional
    public RolesEntity createRole(RolesEntity role) {
        if (role == null) throw new InvalidActionException("Role payload must not be null");
        if (role.getRoleName() == null || role.getRoleName().isBlank())
            throw new InvalidActionException("Role name must not be blank");

        rolesDao.findByRoleName(role.getRoleName()).ifPresent(r -> {
        throw new InvalidActionException("Role name already exists: " + r.getRoleName());
        });

        // Ensure this is treated as NEW
        role.setRoleId(null); // critical: avoid merge -> update
        return rolesDao.save(role); // no need to flush explicitly
    }


    public RolesEntity getRoleById(Integer roleId) {
        if (roleId == null) {
            throw new InvalidActionException("Role ID must not be null");
        }
        return rolesDao.findById(roleId)
                .orElseThrow(() -> new EntityNotFountException(roleId, "Role"));
    }
    
    public List<RolesEntity> getAllRoles() {
        return rolesDao.findAll();
    }

    @Transactional
    public RolesEntity updateRole(Integer roleId, RolesEntity update) {
        if (roleId == null) throw new InvalidActionException("Role ID must not be null");
        if (update == null) throw new InvalidActionException("Update payload must not be null");

        RolesEntity existing = rolesDao.findById(roleId)
            .orElseThrow(() -> new EntityNotFountException(roleId, "Role"));

        if (update.getRoleName() != null && !update.getRoleName().isBlank()
                && !update.getRoleName().equals(existing.getRoleName())) {
            rolesDao.findByRoleName(update.getRoleName()).ifPresent(r -> {
            throw new InvalidActionException("Role name already exists: " + r.getRoleName());
            });
        existing.setRoleName(update.getRoleName());
        }
        return rolesDao.save(existing); // save, no need to flush
    }


    public void deleteRole(Integer roleId) {
        if (roleId == null) {
            throw new InvalidActionException("Role ID must not be null");
        }
        if (!rolesDao.existsById(roleId)) {
            throw new EntityNotFountException(roleId, "Role");
        }
        rolesDao.deleteById(roleId);
    }

    public RolesEntity getRoleByName(String roleName) {
        if (roleName == null || roleName.isBlank()) {
            throw new InvalidActionException("Role name must not be blank");
        }
        return rolesDao.findByRoleName(roleName)
                .orElseThrow(() -> new EntityNotFountException(roleName, "Role"));
    }

    public void assignRole(Integer userId, String roleName) {
        UserEntity u = userDao.findById(userId).orElseThrow(() -> new EntityNotFountException(userId, "User"));
        RolesEntity r = rolesDao.findByRoleName(roleName).orElseThrow(() -> new EntityNotFountException(roleName, "Role"));
        u.getRoles().add(r);
        userDao.save(u);
    }

    public void revokeRole(Integer userId, String roleName) {
        UserEntity u = userDao.findById(userId).orElseThrow(() -> new EntityNotFountException(userId, "User"));
        u.getRoles().removeIf(r -> r.getRoleName().equalsIgnoreCase(roleName));
        userDao.save(u);
    }
}
