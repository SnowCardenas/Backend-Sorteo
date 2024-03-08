const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");
const ResendImport = require("resend");

const resendEmail = new ResendImport.Resend(
  "re_RS8DwDZf_A7WbFTdc8DZiyBSYvhKyZvTq"
);
// Endpoints

router.get("/allTickets", async (req, res) => {
  const tickets = await Ticket.findOne({});
  res.send(tickets);
});

router.get("/search/:idTicket", async (req, res) => {
  try {
    const { idTicket } = req.params;

    const ticket = await Ticket.findOne({});

    if (ticket) {
      const foundTicket = ticket.soldTickets.find(
        (t) => t.ticketNumber === parseInt(idTicket)
      );

      if (foundTicket) {
        res.status(200).json(foundTicket);
      } else {
        res.status(404).send("Ticket no encontrado.");
      }
    } else {
      res.status(404).send("Ticket no encontrado.");
    }
  } catch (error) {
    console.error("Error al buscar el ticket:", error);
    res.status(500).send("Error al buscar el ticket.");
  }
});

router.post("/createTickets", async (req, res) => {
  try {
    // Verifica si ya existen tickets en la base de datos
    const existingTicket = await Ticket.findOne();
    if (existingTicket) {
      console.log("Ya se han creado los tickets.");
      return res.status(400).send("Ya se han creado los tickets");
    }

    // Crea los 1000 tickets
    const tickets = [];
    for (let i = 0; i <= 999; i++) {
      tickets.push({ ticketNumber: i });
    }

    // Guarda los tickets en la base de datos
    const ticketCreated = await Ticket.create({
      stock: 1000,
      soldTickets: tickets,
    });

    console.log("Se han creado los 100 tickets.");
    res.status(201).send(ticketCreated);
  } catch (error) {
    console.error("Error al crear los tickets:", error);
    res.status(500).send({ message: error.message });
  }
});

router.post("/buyTickets", async (req, res) => {
  const { buyerName, buyerEmail, buyerPhone, quantity } = req.body;

  try {
    // Verifica que la cantidad solicitada sea válida
    if (quantity <= 0) {
      console.log("La cantidad de tickets solicitada no es válida.");
      return res
        .status(400)
        .send("La cantidad de tickets solicitada no es válida.");
    }

    // Encuentra la rifa en la base de datos
    const ticket = await Ticket.findOne({});

    // Verifica si hay suficiente stock disponible
    if (ticket.stock < quantity) {
      console.log(
        `Lo siento, solo quedan ${ticket.stock} tickets disponibles.`
      );
      return res
        .status(400)
        .send(`Lo siento, solo quedan ${ticket.stock} tickets disponibles.`);
    }

    // Encuentra los índices de los tickets disponibles
    const availableTicketIndices = ticket.soldTickets.reduce(
      (acc, ticket, index) => {
        if (!ticket.buyerName) acc.push(index);
        return acc;
      },
      []
    );

    // Verifica si hay suficientes tickets disponibles
    if (availableTicketIndices.length < quantity) {
      console.log("Lo siento, no hay suficientes tickets disponibles.");

      return res
        .status(400)
        .send("Lo siento, no hay suficientes tickets disponibles.");
    }

    // Elige aleatoriamente los índices de los tickets disponibles
    const chosenIndices = [];
    while (chosenIndices.length < quantity) {
      const randomIndex = Math.floor(
        Math.random() * availableTicketIndices.length
      );
      const chosenIndex = availableTicketIndices[randomIndex];
      chosenIndices.push(chosenIndex);
      // Elimina el índice elegido para evitar que se seleccione nuevamente
      availableTicketIndices.splice(randomIndex, 1);
    }

    // Actualiza los tickets como vendidos
    for (const index of chosenIndices) {
      ticket.soldTickets[index].buyerName = buyerName;
      ticket.soldTickets[index].buyerEmail = buyerEmail;
      ticket.soldTickets[index].buyerPhone = buyerPhone;
      ticket.stock -= 1;
      ticket.ticketSold += 1;
    }

    // Guarda los cambios en la base de datos
    await ticket.save();

    const ticketTotalesMensaje = `Se han comprado ${quantity} tickets.`;
    const ticketVendidosMensaje = chosenIndices
      .map((index) => `#${ticket.soldTickets[index].ticketNumber}`)
      .join(", ");

    console.log(`Se han comprado ${quantity} tickets.`);
    console.log(
      "Tickets vendidos:",
      chosenIndices
        .map((index) => `#${ticket.soldTickets[index].ticketNumber}`)
        .join(", ")
    );

    const { data, error } = await resendEmail.emails.send({
      from: "Sorteos Oscar <contacto@sorteos-oscar.com>",
      to: [buyerEmail],
      subject: "Boleto Rifa",
      html: `<!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Boletos</title>
        <style>
          body {
            background-color: #222;
            color: #fff;
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
          }
          .container {
            text-align: center;
          }
          .content {
            text-align: center;
            background-color: #222;
            margin: 15% auto;
            padding: 20px;
            border-radius: 5px;
            width: 30%;
          }
          .title {
            color: #fff;
            font-size: 24px;
            margin-bottom: 10px;
          }
          .title .ticket {
            color: #e70009;
          }
          .ticket-container {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .ticket-number {
            color: #e70009;
            text-align: center !important;
            font-size: 36px;
            font-weight: bold;
            z-index: 10;
          }
          .ticket-img {
            position: absolute;
            width: 40%;
          }
          @media (max-width: 768px) {
            .ticket-container {
              flex-direction: column;
            }
            .ticket-img {
              width: 80%;
              margin-bottom: 20px;
            }
            .ticket-number {
              font-size: 24px;
            }
          }
          @media (max-width: 480px) {
            .ticket-img {
              width: 100%;
            }
            .ticket-number {
              font-size: 18px;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="content">
            <h2 class="title">Número de <span class="ticket">Ticket</span></h2>
            <div class="ticket-container">
              <p id="ticketNumber" class="ticket-number">${ticketVendidosMensaje}</p>
              
            </div>
          </div>
        </div>
      </body>
      </html>
      `,
    });

    if (error) {
      console.error("Error al enviar email:", error);
      res.status(500).send({ message: error.message });
    }

    res.status(200).send(`${ticketVendidosMensaje}`);
  } catch (error) {
    console.error("Error al comprar los tickets:", error);
    res.status(500).send({ message: error.message });
  }
});

router.delete("/deleteAllTickets", async (req, res) => {
  await Ticket.deleteMany();
  res.status(201).send("Todos los tickets fueron borrados");
});

module.exports = router;
