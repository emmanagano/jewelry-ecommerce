// Prices are stored as integer cents
export function formatPrice(cents: number) {
	return (cents / 100).toLocaleString("en-US", {
		style: "currency",
		currency: "USD",
	});
}
