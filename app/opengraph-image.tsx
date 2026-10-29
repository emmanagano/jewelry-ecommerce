import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/app/lib/site";

// Default social preview for pages without their own image (product,
// category and collection pages set one from their photos)
export const alt = `${SITE_NAME} | ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					background: "#f7f3ee",
					color: "#1f1a17",
					fontFamily: "serif",
				}}
			>
				<div
					style={{
						fontSize: 88,
						letterSpacing: "0.2em",
						textTransform: "uppercase",
					}}
				>
					{SITE_NAME}
				</div>
				<div
					style={{
						marginTop: 28,
						width: 96,
						height: 1,
						background: "#5a1a24",
						opacity: 0.4,
					}}
				/>
				<div
					style={{
						marginTop: 28,
						fontSize: 28,
						letterSpacing: "0.3em",
						textTransform: "uppercase",
						color: "#6e625a",
					}}
				>
					{SITE_TAGLINE}
				</div>
			</div>
		),
		size,
	);
}
