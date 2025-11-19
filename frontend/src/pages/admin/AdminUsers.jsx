import React, { useState } from "react";
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, InputLabel, FormControl,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const roles = ["admin", "marketing", "content", "sales", "customer"];

const mockUsers = [
  { id: 1, name: "Alice", email: "alice@example.com", role: "admin", createdAt: "2025-11-01" },
  { id: 2, name: "Bob", email: "bob@example.com", role: "marketing", createdAt: "2025-11-05" },
  { id: 3, name: "Charlie", email: "charlie@example.com", role: "customer", createdAt: "2025-11-10" },
];

export default function AdminUsers() {
  const [users, setUsers] = useState(mockUsers);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  const [formData, setFormData] = useState({ name: "", email: "", role: "customer",
  });

  const handleOpenDialog = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({ name: user.name, email: user.email, role: user.role });
    } else {
      setEditingUser(null);
      setFormData({ name: "", email: "", role: "customer" });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    if (editingUser) {
      setUsers(prev =>
        prev.map(u => (u.id === editingUser.id ? { ...u, ...formData } : u))
      );
    } else {
      const newUser = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setUsers(prev => [...prev, newUser]);
    }

    handleCloseDialog();
  };

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setOpenDeleteDialog(true);
  };

  const cancelDelete = () => setOpenDeleteDialog(false);

  const handleDelete = () => {
    setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
    setOpenDeleteDialog(false);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>Admin User Management</Typography>

      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
        Create New User
      </Button>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.createdAt}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(user)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => confirmDelete(user)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create / Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingUser ? "Edit User" : "Create User"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField label="Name" name="name" value={formData.name} onChange={handleChange} />
          <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />

          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select name="role" value={formData.role} onChange={handleChange} label="Role">
              {roles.map(role => (
                <MenuItem key={role} value={role}>{role}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {editingUser ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={cancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>{userToDelete?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
