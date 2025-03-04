import express from "express";
import braintree from "braintree";
import dotenv from "dotenv";
import * as user from "../Models/ModelUser.js";

dotenv.config();

const router = express.Router();
/* // Configuración de Braintree (parte de PayPal)
const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox, // Cambia a Production cuando vayas en vivo
    merchantId: process.env.PAYPAL_MERCHANT_ID,
    publicKey: process.env.PAYPAL_PUBLIC_KEY,
    privateKey: process.env.PAYPAL_PRIVATE_KEY,
}); */

// Configuración de Braintree (parte de PayPal)
const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: "4vqxrkv8xkrhzjxd",
    publicKey: "jmww8m4vjkb6ktsr",
    privateKey: "cf92b956c7c643cbbcb953fcd3bf93f1",
});

// 🔥 Endpoint para obtener el Client Token
router.get("/get-client-token", async (req, res) => {
    try {
        const response = await gateway.clientToken.generate({});
        res.json({ clientToken: response.clientToken });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint para crear un cliente
router.post("/create-customer", async (req, res) => {
    const { firstName, lastName, email, id } = req.body;

    try {
        const result = await gateway.customer.create({
            firstName,
            lastName,
            email
        });

        if (result.success) {
            res.json({ success: true, customerId: result.customer.id });
            await user.updateIdPaypal(id, result.customer.id)
        } else {
            res.status(500).json({ error: result.message });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 🔥 Endpoint para procesar pagos con tarjeta
router.post("/process-payment", async (req, res) => {
    try {
        const { amount, paymentMethodNonce, paymentMethodToken, customerId, selectCard } = req.body;

        //if (!paymentMethodNonce || !paymentMethodToken) {
           // return res.status(400).json({ error: "El método de pago es requerido" });
        //}

        const saleRequest = {
            amount,
            paymentMethodNonce,
            customerId,
            options: {
                submitForSettlement: true, // Captura el pago inmediatamente
            },
        };
        const saleRequestToken = {
            amount,
            paymentMethodToken,
            customerId,
            options: {
                submitForSettlement: true,
            },
        };

        const result = await gateway.transaction.sale(selectCard?saleRequestToken:saleRequest);
        if (result.success) {
            res.json({ success: true, transaction: result.transaction });
        } else {
            res.status(500).json({ error: result.message });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Endpoint para guardar la tarjeta de forma segura
router.post("/save-card", async (req, res) => {
    const { paymentMethodNonce, customerId } = req.body;

    if (!paymentMethodNonce || !customerId) {
        return res.status(400).json({ error: "paymentMethodNonce y customerId son requeridos" });
    }

    try {
        // Crear un Payment Method asociado al cliente
        const result = await gateway.paymentMethod.create({
            customerId: customerId,  
            paymentMethodNonce: paymentMethodNonce,
            options: {
                makeDefault: true,  
            },
        });
    
        if (result.success) {

            res.json({ success: true, paymentMethod: result.paymentMethod });
        } else {
            res.status(500).json({ error: result.message });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/get-cards/:customerId', async (req, res) => {
    const { customerId } = req.params;
  
    try {
      const customer = await gateway.customer.find(customerId);
      const paymentMethods = customer.creditCards.map(card => ({
        token: card.token,
        lastFour: card.last4,
        cardType: card.cardType,
        expirationMonth: card.expirationMonth,
        expirationYear: card.expirationYear,
        maskedNumber: card.maskedNumber,
        img: card.imageUrl

      }));
  
      res.status(200).json(paymentMethods);
    } catch (error) {
      console.error('Error obteniendo tarjetas guardadas:', error);
      res.status(500).json({ message: 'Error obteniendo tarjetas guardadas', error });
    }
  });


export default router;

