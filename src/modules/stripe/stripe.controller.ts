import { Request, Response } from "express";
import { stripe } from "./stripe.service";
import prisma from "../../database/prisma";

// 💰 CRIAR CHECKOUT
export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user?.id) {
      return res.status(401).json({
        error: "Usuário não autenticado",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: "Plano PRO",
            },
            unit_amount: 1990,
          },
          quantity: 1,
        },
      ],

      success_url: `${process.env.FRONT_URL}/success`,
      cancel_url: `${process.env.FRONT_URL}/cancel`,

      metadata: {
        userId: String(user.id),
      },
    });

    return res.json({ url: session.url });
  } catch (error) {
    console.error("❌ Erro ao criar checkout:", error);

    return res.status(500).json({
      error: "Erro ao criar sessão de pagamento",
    });
  }
};

// 🔥 WEBHOOK (VERSÃO COMPATÍVEL COM QUALQUER STRIPE)
export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;

  let event: any; // 🔥 resolve erro de tipagem

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("❌ Webhook inválido:", err);
    return res.status(400).send(`Webhook Error`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any; // 🔥 evita erro de tipo

      const userId = Number(session.metadata?.userId);

      if (!userId) {
        console.error("❌ userId não encontrado no metadata");
        return res.json({ received: true });
      }

      await prisma.user.update({
        where: { id: userId },
        data: {
          plan: "PRO",
        },
      });

      console.log("💰 Usuário virou PRO:", userId);
    }

    return res.json({ received: true });
  } catch (error) {
    console.error("❌ Erro no webhook:", error);

    return res.status(500).json({
      error: "Erro interno no webhook",
    });
  }
};