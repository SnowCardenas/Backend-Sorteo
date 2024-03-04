const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema(
  {
    stock: {
      type: Number,
      required: true,
      default: 1000,
    },
    ticketSold: {
      type: Number,
      required: true,
      default: 0,
    },
    soldTickets: {
      type: [
        {
          ticketNumber: Number,
          buyerName: String,
          buyerEmail: String,
          buyerPhone: String,
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", TicketSchema);
