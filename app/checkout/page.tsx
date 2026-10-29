import type { Metadata } from "next";
import CheckoutForm from "./CheckoutForm";

export const metadata: Metadata = {
	title: "Checkout",
	robots: { index: false },
};

export default function CheckoutPage() {
	return (
		<div className="min-h-screen max-w-screen-2xl mx-auto px-4 sm:px-8 py-12 bg-(--bg-base)">
			<CheckoutForm />
		</div>
	);
}
