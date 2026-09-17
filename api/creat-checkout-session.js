// api/create-checkout-session.js
// DEALORA — Stripe Checkout do VENDEDOR
// Taxa de publicação: £29.99
// IMPORTANTE: a chave secreta fica somente na Vercel:
// STRIPE_SECRET_KEY = sk_...
// Nunca coloque a chave secreta diretamente neste arquivo.

const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async function handler(req, res) {
  // Permite apenas POST
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");

    return res.status(405).json({
      error: "Method not allowed. Use POST."
    });
  }

  try {
    // Verifica se a variável existe na Vercel
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is missing.");

      return res.status(500).json({
        error: "Stripe configuration is missing."
      });
    }

    /*
      DEALORA — SELLER PUBLICATION PAYMENT

      £29.99 = 2999 pence

      Não colocamos dados de cartão aqui.
      O comprador/vendedor digita os dados diretamente
      na página segura do Stripe Checkout.
    */

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "gbp",

            product_data: {
              name: "Dealora — Business Listing",
              description:
                "Seller publication fee to list a business for sale on Dealora."
            },

            unit_amount: 2999
          },

          quantity: 1
        }
      ],

      metadata: {
        platform: "dealora",
        payment_type: "seller_listing",
        amount: "29.99",
        currency: "GBP"
      },

      success_url:
        "https://dealora.vercel.app/success.html?session_id={CHECKOUT_SESSION_ID}",

      cancel_url:
        "https://dealora.vercel.app/sell/index.html?payment=cancelled"
    });

    return res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    console.error("DEALORA STRIPE ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message || "Unable to create Stripe Checkout session."
    });
  }
};
