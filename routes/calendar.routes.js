const { Router } = require("express");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const router = Router();
const User = require("../models/User");
const Reservation = require("../models/Reservation");
const auth = require("./middleware/auth.middleware")

// /api/reservations
router.post(
  "/",
  [
    check("email", "некоректный емейл").isEmail(),
  ],
  async (req, res) => {
    try {
      const { name, email, phone, descr, start, end, title, owner, roomType, roomPrice} = req.body;

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({
            errors: errors.array(),
            message: "некоректные данные при создании бронирования",
          });
      }
      const existing = await Reservation.find({start});
      console.log('existing events', existing.length)
      if (existing.length > 3) {
        return res
          .status(400)
          .json({ message: "На эти даты нету свободных номеров" });
      }
      const reservation = new Reservation({ name, email, phone, descr, start, end, title, owner, roomType, roomPrice});


      await reservation.save();
      res.status(201).json({ message: "Резервация создана успешно" });
    } catch (error) {
      res.status(500).json({ message: "что-то пошло не так попробуйте снова" });
    }
  }
);

// /api/reservations
router.get(
  "/",
  async (req, res) => {
    try {  
      const reservations = await Reservation.find({owner: req.query.userId,roomType: req.query.roomType}).sort({start: -1});

      res.json(reservations);
    } catch (error) {
      res.status(500).json({ message: "что-то пошло не так" });
    }
  }
);
// /api/reservations
router.delete(
  "/",
  async (req, res) => {
    try { 
      const reservation = await Reservation.deleteOne({_id: req.query.id});
      res.status(201).json({ message: "резервация успешно удалена"});
    } catch (error) {
      res.status(500).json({ message: "что-то пошло не так" });
    }
  }
);

// /api/reservations
router.patch("/",
  async (req, res) => {
    try {
      // console.log(req.body)
      const { _id} = req.body;


      
      // const existing = await Reservation.find({start});
      // console.log('existing events', existing.length)
      // if (existing.length > 3) {
      //   return res
      //     .status(400)
      //     .json({ message: "На эти даты нету свободных номеров" });
      // }
      const editedReservation = await Reservation.findOneAndUpdate({_id}, {...req.body}, {
        new: true
      });
      res.status(201).json(editedReservation);
      //  res.status(201).json({ message: "резервация успешно изменена" });
      // const reservation = new Reservation({ name, email, phone, descr, start, end, title, owner, roomType, roomPrice});


      // await reservation.save();
      // res.status(201).json({ message: "Резервация создана успешно" });
    } catch (error) {
      res.status(500).json({ message: "что-то пошло не так попробуйте снова" });
    }
  }
);

module.exports = router;
