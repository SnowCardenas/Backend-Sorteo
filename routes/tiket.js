const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");

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
      const foundTicket = ticket.soldTickets.find((t) => t.ticketNumber === parseInt(idTicket));

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
    for (let i = 1; i <= 1000; i++) {
      tickets.push({ ticketNumber: i });
    }

    // Guarda los tickets en la base de datos
    const ticketCreated = await Ticket.create({ stock: 1000, soldTickets: tickets });

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
      return res.status(400).send("La cantidad de tickets solicitada no es válida.");
    }

    // Encuentra la rifa en la base de datos
    const ticket = await Ticket.findOne({});

    // Verifica si hay suficiente stock disponible
    if (ticket.stock < quantity) {
      console.log(`Lo siento, solo quedan ${ticket.stock} tickets disponibles.`);
      return res.status(400).send(`Lo siento, solo quedan ${ticket.stock} tickets disponibles.`);
    }

    // Encuentra los índices de los tickets disponibles
    const availableTicketIndices = ticket.soldTickets.reduce((acc, ticket, index) => {
      if (!ticket.buyerName) acc.push(index);
      return acc;
    }, []);

    // Verifica si hay suficientes tickets disponibles
    if (availableTicketIndices.length < quantity) {
      console.log("Lo siento, no hay suficientes tickets disponibles.");

      return res.status(400).send("Lo siento, no hay suficientes tickets disponibles.");
    }

    // Elige aleatoriamente los índices de los tickets disponibles
    const chosenIndices = [];
    while (chosenIndices.length < quantity) {
      const randomIndex = Math.floor(Math.random() * availableTicketIndices.length);
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
    const ticketVendidosMensaje =
      "Tickets vendidos: " + chosenIndices.map((index) => `#${ticket.soldTickets[index].ticketNumber}`).join(", ");

    console.log(`Se han comprado ${quantity} tickets.`);
    console.log(
      "Tickets vendidos:",
      chosenIndices.map((index) => `#${ticket.soldTickets[index].ticketNumber}`).join(", ")
    );
    res.status(200).send(`${ticketTotalesMensaje} , ${ticketVendidosMensaje}`);
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
