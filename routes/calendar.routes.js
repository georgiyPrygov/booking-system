const { Router } = require("express");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const config = require("config");
const router = Router();
const User = require("../models/User");
const Reservation = require("../models/Reservation");
const auth = require("./middleware/auth.middleware");
const sgMail = require("@sendgrid/mail");
const moment = require("moment");

sgMail.setApiKey(config.get("sendgridKey"));

// /api/reservations
router.post(
  "/",
  [check("email", "Некоректний емейл").isEmail()],
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
        guests,
        totalPrice,
        nightsCount,
        bookingDate,
        isAdmin
      } = req.body;


      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Некоректні данні при створенні бронбвання",
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
        guests,
        totalPrice,
        nightsCount,
        bookingDate,
      });

      if(isAdmin === false) {
        moment.locale('ua')
        const clientMsg = {
          to: email,
          from: 'agorahotel.in.ua@gmail.com',
          templateId: 'd-17aad223abdd4463b9e57e3b048db3ba',
          dynamic_template_data: {
            start: moment(start).format("DD.MM.YY"),
            end: moment(end).format("DD.MM.YY"),
            prepayment: totalPrice / nightsCount
          },
        }
  
        const adminMsg = {
          to: "agorahotel.in.ua@gmail.com", // Change to your recipient
          from: "agorahotel.in.ua@gmail.com", // Change to your verified sender
          templateId: 'd-0420f4f0ec5944299af49dd5a977b48a',
          dynamic_template_data: {
            name,
            email,
            phone,
            descr,
            start: moment(start).format("DD.MM.YY"),
            end: moment(end).format("DD.MM.YY"),
            roomType,
            roomPrice,
            guests,
            startSubject: moment(start).format('MMMM Do YYYY'),
            totalPrice,
            nightsCount
          }
        }
        sgMail.send(adminMsg)
        sgMail.send(clientMsg)
      }

      await reservation.save();
      res.status(201).json({ message: "Номер успішно заброньовано" });
    } catch (error) {
      res.status(500).json({ message: "Щось пішло не так спробуйте знову" });
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
    res.status(500).json({ message: "Щось пішло не так" });
  }
});
// /api/reservations
router.delete("/", async (req, res) => {
  try {
    const reservation = await Reservation.deleteOne({ _id: req.query.id });
    res.status(201).json({ message: "Резервація успішно скасована" });
  } catch (error) {
    res.status(500).json({ message: "Щось пішло не так" });
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
    res.status(500).json({ message: "Щось пішло не так спробуйте знову" });
  }
});

module.exports = router;
