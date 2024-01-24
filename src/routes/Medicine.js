const express = require('express');
const router = express.Router();
const medicineV4Controller = require('../app/controllers/MedicineV4Controller');

router.get('/get-all-medicine-v4/:medicineType', (req, res) => {
    const medicineType = req.params.medicineType;
    medicineV4Controller.getAllMedicine(req, res, medicineType);
});

router.post('/search/:medicineType', (req, res) => {
    const medicineType = req.params.medicineType;
    medicineV4Controller.search(req, res, medicineType);
});

module.exports = router;
