import express from "express";
import braintree from "braintree";
import dotenv from "dotenv";

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

// 🔥 Endpoint para procesar pagos con tarjeta
router.post("/process-payment", async (req, res) => {
    try {
        const { amount, paymentMethodNonce } = req.body;

        if (!paymentMethodNonce) {
            return res.status(400).json({ error: "El método de pago es requerido" });
        }

        const saleRequest = {
            amount,
            paymentMethodNonce,
            options: {
                submitForSettlement: true, // Captura el pago inmediatamente
            },
        };

        const result = await gateway.transaction.sale(saleRequest);

        if (result.success) {
            res.json({ success: true, transactionId: result.transaction.id });
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
            customerId: customerId,  // ID del cliente que ya existe en Braintree
            paymentMethodNonce: paymentMethodNonce,
            options: {
                makeDefault: true,  // Marca esta tarjeta como la tarjeta por defecto del cliente
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


export default router;

