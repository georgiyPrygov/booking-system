const { Router } = require("express");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const router = Router();
const User = require("../models/User");
const Reservation = require("../models/Reservation");
const auth = require("./middleware/auth.middleware");

// /api/reservations
router.post(
  "/",
  [check("email", "некоректный емейл").isEmail()],
  async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        descr,
        start,
        end,
        title,
        owner,
        roomType,
        roomPrice,
        paymentStatus,
      } = req.body;

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "некоректные данные при создании бронирования",
        });
      }

      const reservation = new Reservation({
        name,
        email,
        phone,
        descr,
        start,
        end,
        title,
        owner,
        roomType,
        roomPrice,
        paymentStatus,
      });

      await reservation.save();
      res.status(201).json({ message: "Резервация создана успешно" });
    } catch (error) {
      res.status(500).json({ message: "что-то пошло не так попробуйте снова" });
    }
  }
);

// /api/reservations
router.get("/", async (req, res) => {
  try {
    let reservations = [];
    if (req.query.roomType) {
      reservations = await Reservation.find({
        owner: req.query.userId,
        roomType: req.query.roomType,
      }).sort({ start: -1 });
    } else {
      reservations = await Reservation.find({ owner: req.query.userId }).sort({
        start: -1,
      });
    }

    if (req.query.isAdmin === "true") {
      res.json(reservations);
    } else {
      const filtered = reservations.map((item) => ({
        start: item.start,
        end: item.end,
        roomPrice: item.roomPrice,
        roomType: item.roomType,
      }));
      res.json(filtered);
    }
  } catch (error) {
    res.status(500).json({ message: "что-то пошло не так" });
  }
});
// /api/reservations
router.delete("/", async (req, res) => {
  try {
    const reservation = await Reservation.deleteOne({ _id: req.query.id });
    res.status(201).json({ message: "резервация успешно удалена" });
  } catch (error) {
    res.status(500).json({ message: "что-то пошло не так" });
  }
});

// /api/reservations
router.patch("/", async (req, res) => {
  try {
    const { _id } = req.body;

    const editedReservation = await Reservation.findOneAndUpdate(
      { _id },
      { ...req.body },
      {
        new: true,
      }
    );
    res.status(201).json(editedReservation);
  } catch (error) {
    res.status(500).json({ message: "что-то пошло не так попробуйте снова" });
  }
});

module.exports = router;
