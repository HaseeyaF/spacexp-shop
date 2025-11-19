import React, { useState } from "react";
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, 
  InputLabel, FormControl, Checkbox, FormControlLabel,
} from "@mui/material";

const AdminPromos = () => {
  const [openForm, setOpenForm] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [form, setForm] = useState({
    code: "",
    discountType: "percent",
    discountValue: "",
    minAmount: "",
    maxUses: "",
    firstTimeOnly: false,
    recurringCustomerDiscount: false,
    validFrom: "",
    validTo: "",
    active: true,
  });

  const samplePromos = [
    {
      _id: "1",
      code: "WELCOME10",
      discountType: "percent",
      discountValue: 10,
      minAmount: 1000,
      maxUses: 50,
      uses: 12,
      validFrom: "2025-01-01",
      validTo: "2025-02-01",
      active: true,
    },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2} fontWeight={600}>Promo Code Management</Typography>

      <Button variant="contained" onClick={() => setOpenForm(true)}>+ Create Promo</Button>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead sx={{ background: "#f5f5f5" }}>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Min Amount</TableCell>
              <TableCell>Max Uses</TableCell>
              <TableCell>Used</TableCell>
              <TableCell>Valid From</TableCell>
              <TableCell>Valid To</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {samplePromos.map((p) => (
              <TableRow key={p._id}>
                <TableCell>{p.code}</TableCell>
                <TableCell>{p.discountType}</TableCell>
                <TableCell>{p.discountValue}</TableCell>
                <TableCell>{p.minAmount}</TableCell>
                <TableCell>{p.maxUses}</TableCell>
                <TableCell>{p.uses}</TableCell>
                <TableCell>{p.validFrom}</TableCell>
                <TableCell>{p.validTo}</TableCell>
                <TableCell>{p.active ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <Button size="small" sx={{ mr: 1 }}>Edit</Button>
                  <Button size="small" color="error" onClick={() => setOpenDelete(true)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Form Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Promo</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Promo Code" name="code" value={form.code} onChange={handleChange} sx={{ mt: 2 }} />

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Discount Type</InputLabel>
            <Select name="discountType" value={form.discountType} onChange={handleChange}>
              <MenuItem value="percent">Percent</MenuItem>
              <MenuItem value="fixed">Fixed Amount</MenuItem>
            </Select>
          </FormControl>

          <TextField fullWidth label="Discount Value" type="number" name="discountValue" value={form.discountValue} onChange={handleChange} sx={{ mt: 2 }} />
          <TextField fullWidth label="Minimum Amount" type="number" name="minAmount" value={form.minAmount} onChange={handleChange} sx={{ mt: 2 }} />
          <TextField fullWidth label="Max Uses" type="number" name="maxUses" value={form.maxUses} onChange={handleChange} sx={{ mt: 2 }} />

          <Box mt={2}>
            <FormControlLabel control={<Checkbox name="firstTimeOnly" checked={form.firstTimeOnly} onChange={handleChange} />} label="First Time Customers Only" />
            <FormControlLabel control={<Checkbox name="recurringCustomerDiscount" checked={form.recurringCustomerDiscount} onChange={handleChange} />} label="Recurring Customer Discount" />
            <FormControlLabel control={<Checkbox name="active" checked={form.active} onChange={handleChange} />} label="Active" />
          </Box>

          <TextField fullWidth label="Valid From" type="date" name="validFrom" InputLabelProps={{ shrink: true }} value={form.validFrom} onChange={handleChange} sx={{ mt: 2 }} />
          <TextField fullWidth label="Valid To" type="date" name="validTo" InputLabelProps={{ shrink: true }} value={form.validTo} onChange={handleChange} sx={{ mt: 2 }} />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancel</Button>
          <Button variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this promo code?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPromos;