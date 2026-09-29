"""
Payment processing service layer.

Kept separate from views so the payment provider can be swapped (Stripe today,
PayPal/Razorpay later) without touching the checkout view logic.
"""
from decouple import config


class PaymentError(Exception):
    pass


def charge_payment(amount, currency, payment_method_id, description=""):
    """
    Stripe-ready charge function.

    In production, this calls stripe.PaymentIntent.create(...) using STRIPE_SECRET_KEY
    from the environment, confirms it with the given payment_method_id, and returns
    the PaymentIntent id. Wire it up like:

        import stripe
        stripe.api_key = config("STRIPE_SECRET_KEY")
        intent = stripe.PaymentIntent.create(
            amount=int(amount * 100),
            currency=currency,
            payment_method=payment_method_id,
            confirm=True,
            description=description,
        )
        if intent.status != "succeeded":
            raise PaymentError(f"Payment not completed: {intent.status}")
        return intent.id

    Left as a stub here since no live Stripe keys are configured in this
    environment — see README "Payments" section for how to enable it.
    """
    if not config("STRIPE_SECRET_KEY", default=""):
        # No key configured — simulate success so checkout can be exercised end-to-end.
        return f"pi_stub_{payment_method_id}"

    raise NotImplementedError("Add the stripe SDK call shown in this function's docstring.")
