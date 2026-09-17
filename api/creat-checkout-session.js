// ============================================================
// DEALORA
// api/create-checkout-session.js
// STRIPE CHECKOUT — VENDEDOR
// Taxa de publicação: £29.99
// ============================================================

const Stripe = require("stripe");

// A chave secreta deve ficar SOMENTE nas Environment Variables
// da Vercel com o nome:
// STRIPE_SECRET_KEY
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async function handler(req, res) {
  // ----------------------------------------------------------
  // 1. CORS / MÉTODO
  // ----------------------------------------------------------

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);

    return res.status(405).json({
      success: false,
      error: "Method not allowed. Use POST."
    });
  }

  // ----------------------------------------------------------
  // 2. CONFIRMAR CONFIGURAÇÃO DO STRIPE
  // ----------------------------------------------------------

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error(
      "DEALORA ERROR: STRIPE_SECRET_KEY is not configured."
    );

    return res.status(500).json({
      success: false,
      error: "Stripe secret key is not configured."
    });
  }

  try {
    // --------------------------------------------------------
    // 3. DESCOBRIR O DOMÍNIO ATUAL DA DEALORA
    // --------------------------------------------------------

    const protocol =
      req.headers["x-forwarded-proto"] || "https";

    const host = req.headers.host;

    if (!host) {
      throw new Error(
        "Unable to determine Dealora website address."
      );
    }

    const baseUrl = `${protocol}://${host}`;

    // --------------------------------------------------------
    // 4. CRIAR STRIPE CHECKOUT DO VENDEDOR
    // --------------------------------------------------------
    //
    // £29.99 = 2999 pence
    //
    // IMPORTANTE:
    // O valor é criado no servidor.
    // O navegador NÃO decide quanto será cobrado.
    // --------------------------------------------------------

    const session =
      await stripe.checkout.sessions.create({
        mode: "payment",

        payment_method_types: ["card"],

        line_items: [
          {
            price_data: {
              currency: "gbp",

              product_data: {
                name:
                  "Dealora — Seller Business Listing",

                description:
                  "Business listing publication fee on Dealora."
              },

              unit_amount: 2999
            },

            quantity: 1
          }
        ],

        // ----------------------------------------------------
        // REFERÊNCIA INTERNA DO PAGAMENTO
        // ----------------------------------------------------

        metadata: {
          platform: "dealora",
          payment_type: "seller_listing",
          seller_fee: "29.99",
          currency: "GBP"
        },

        // ----------------------------------------------------
        // APÓS PAGAMENTO APROVADO
        // ----------------------------------------------------

        success_url:
          `${baseUrl}/success.html` +
          `?session_id={CHECKOUT_SESSION_ID}` +
          `&payment=seller_listing`,

        // ----------------------------------------------------
        // SE O VENDEDOR CANCELAR
        // ----------------------------------------------------

        cancel_url:
          `${baseUrl}/vender.html?payment=cancelled`
      });

    // --------------------------------------------------------
    // 5. GARANTIR QUE O STRIPE RETORNOU A URL
    // --------------------------------------------------------

    if (!session.url) {
      throw new Error(
        "Stripe did not return a Checkout URL."
      );
    }

    console.log(
      "DEALORA: Seller Stripe Checkout created:",
      session.id
    );

    // --------------------------------------------------------
    // 6. ENVIAR URL PARA vender.html
    // --------------------------------------------------------

    return res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url
    });

  } catch (error) {
    // --------------------------------------------------------
    // 7. ERRO
    // --------------------------------------------------------

    console.error(
      "DEALORA STRIPE CHECKOUT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      error:
        error && error.message
          ? error.message
          : "Unable to create Stripe Checkout session."
    });
  }
};
