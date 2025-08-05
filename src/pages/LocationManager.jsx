import React, { useEffect, useState } from 'react';
import {
  Stack,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
  Grid,
  Dialog,
  DialogTitle,
  DialogActions,
  Divider,
  Paper,
  useTheme,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import axios from 'axios';

const BASE_URL = `${process.env.REACT_APP_BASE_URL}/api/locations`;

export const LocationManager = () => {
  const theme = useTheme();

  const [locations, setLocations] = useState([]);
  const [form, setForm] = useState({ state: '', city: '', postalCodes: '' });
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    const res = await axios.get(BASE_URL);
    const flatList = [];

    for (const state in res.data) {
      for (const city in res.data[state]) {
        flatList.push({
          state,
          city,
          postalCodes: res.data[state][city],
        });
      }
    }

    setLocations(flatList);
  };

  const handleSubmit = async () => {
    const payload = {
      state: form.state,
      city: form.city,
      postalCodes: form.postalCodes.split(',').map(code => code.trim()),
    };

    if (editId) {
      await axios.put(`${BASE_URL}/${editId}`, payload);
      setEditId(null);
    } else {
      await axios.post(BASE_URL, payload);
    }

    setForm({ state: '', city: '', postalCodes: '' });
    fetchLocations();
  };

  const handleEdit = async (location) => {
    const res = await axios.get(`${BASE_URL}/filter?state=${location.state}&city=${location.city}`);
    const target = res.data[0];
    setEditId(target._id);
    setForm({
      state: target.state,
      city: target.city,
      postalCodes: target.postalCodes.join(', '),
    });
  };

  const handleDeletePrompt = async (loc) => {
    const res = await axios.get(`${BASE_URL}/filter?state=${loc.state}&city=${loc.city}`);
    const target = res.data[0];
    setDeleteId(target._id);
  };

  const handleDelete = async () => {
    await axios.delete(`${BASE_URL}/${deleteId}`);
    setDeleteId(null);
    fetchLocations();
  };

  return (
    <Paper elevation={0} sx={{ p: 4, backgroundColor: theme.palette.background.default }}>
      {/* Header */}
      <Typography variant="h4" fontWeight={700} gutterBottom color="primary">
        📍 Location Manager
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Add, update, or delete serviceable locations and pincodes
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {/* Form */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3, mb: 4 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            variant="filled"
            label="State"
            fullWidth
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
          />
          <TextField
            variant="filled"
            label="City"
            fullWidth
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
          <TextField
            variant="filled"
            label="Postal Codes"
            placeholder="Comma separated"
            fullWidth
            value={form.postalCodes}
            onChange={(e) => setForm({ ...form, postalCodes: e.target.value })}
          />
          <Button variant="contained" size="large" onClick={handleSubmit}>
            {editId ? 'Update' : 'Add'}
          </Button>
          {editId && (
            <Button
              variant="outlined"
              color="error"
              size="large"
              onClick={() => {
                setEditId(null);
                setForm({ state: '', city: '', postalCodes: '' });
              }}
            >
              Cancel
            </Button>
          )}
        </Stack>
      </Paper>

      {/* Locations List */}
      <Grid container spacing={3}>
        {locations.map((loc, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card
              elevation={4}
              sx={{
                borderRadius: 3,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight={600}>
                  {loc.city}, {loc.state}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Pincodes: {loc.postalCodes.join(', ')}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <IconButton onClick={() => handleEdit(loc)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeletePrompt(loc)}>
                    <Delete />
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Delete Dialog */}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
        <DialogTitle>
          Are you sure you want to delete this location?
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
