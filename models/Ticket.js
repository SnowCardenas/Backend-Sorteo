import { Schema, model } from "mongoose";

const TicketSchema = new Schema(
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

export default model("Ticket", TicketSchema);
