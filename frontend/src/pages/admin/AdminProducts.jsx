import React, { useState } from "react";
import { Box, Button, TextField, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, FormControlLabel,
} from "@mui/material";
import { Delete, Edit, Add } from "@mui/icons-material";

export default function AdminProducts() {
  // PRODUCT STATE
  const [products, setProducts] = useState([
    {
      _id: "1",
      name: "Product 1",
      brand: "Brand A",
      category: "Category X",
      basePrice: 100,
      tags: ["new"],
      variants: [{ color: "Red", price: 100 }],
      isDeal: true,
    },
    {
      _id: "2",
      name: "Product 2",
      brand: "Brand B",
      category: "Category Y",
      basePrice: 200,
      tags: [],
      variants: [{ color: "Black", price: 200 }],
      isDeal: false,
    },
  ]);

  // DIALOG & FORM STATE
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const emptyProduct = {
    _id: "",
    name: "",
    brand: "",
    category: "",
    basePrice: 0,
    tags: [],
    isDeal: false,
    variants: [],
  };

  const [formData, setFormData] = useState(emptyProduct);

  // OPEN DIALOG FOR ADD PRODUCT
  const handleAddProduct = () => {
    setIsEditing(false);
    setFormData(emptyProduct);
    setOpenDialog(true);
  };

  // OPEN DIALOG FOR EDIT PRODUCT
  const handleEditProduct = (product) => {
    setIsEditing(true);
    setFormData(product);
    setOpenDialog(true);
  };

  // DELETE PRODUCT (UI ONLY)
  const handleDeleteProduct = () => {
    setProducts(products.filter((p) => p._id !== deleteId));
    setConfirmOpen(false);
    setDeleteId(null);
  };

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // SAVE PRODUCT (ADD OR UPDATE)
  const saveProduct = () => {
    if (isEditing) {
      // update existing
      setProducts(products.map((p) => (p._id === formData._id ? formData : p)));
    } else {
      // add new product
      setProducts([
        ...products,
        {
          ...formData,
          _id: Date.now().toString(), // fake ID
        },
      ]);
    }

    setOpenDialog(false);
  };

  // ADD VARIANT
  const addVariant = () => {
    const updated = [...formData.variants, { color: "", price: 0 }];
    setFormData({ ...formData, variants: updated });
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Products Management</Typography>

        <Button variant="contained" onClick={handleAddProduct}>
          Add Product
        </Button>
      </Box>

      {/* PRODUCT TABLE */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Variants</TableCell>
              <TableCell>Deal</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products.map((p) => (
              <TableRow key={p._id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.brand}</TableCell>
                <TableCell>{p.category}</TableCell>
                <TableCell>${p.basePrice}</TableCell>
                <TableCell>{p.variants.length}</TableCell>
                <TableCell>{p.isDeal ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditProduct(p)}>
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setDeleteId(p._id);
                      setConfirmOpen(true);
                    }}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* DIALOG */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>{isEditing ? "Edit Product" : "Add Product"}</DialogTitle>

        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <TextField
              label="Brand"
              value={formData.brand}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
            />

            <TextField
              label="Category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            />

            <TextField
              label="Base Price"
              type="number"
              value={formData.basePrice}
              onChange={(e) =>
                setFormData({ ...formData, basePrice: Number(e.target.value) })
              }
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isDeal}
                  onChange={(e) =>
                    setFormData({ ...formData, isDeal: e.target.checked })
                  }
                />
              }
              label="Is Deal?"
            />

            {/* Variants */}
            <Box mt={3}>
              <Typography variant="h6" mb={1}>
                Variants
              </Typography>

              {formData.variants.map((v, i) => (
                <Box key={i} display="flex" gap={2} alignItems="center" mb={1}>
                  <TextField
                    label="Color"
                    value={v.color}
                    onChange={(e) => {
                      const updated = [...formData.variants];
                      updated[i].color = e.target.value;
                      setFormData({ ...formData, variants: updated });
                    }}
                  />

                  <TextField
                    label="Price"
                    type="number"
                    value={v.price}
                    onChange={(e) => {
                      const updated = [...formData.variants];
                      updated[i].price = Number(e.target.value);
                      setFormData({ ...formData, variants: updated });
                    }}
                  />

                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      const updated = [...formData.variants];
                      updated.splice(i, 1);
                      setFormData({ ...formData, variants: updated });
                    }}
                  >
                    Remove
                  </Button>
                </Box>
              ))}

              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={addVariant}
              >
                Add Variant
              </Button>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={saveProduct}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this product?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteProduct}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
