import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/app/lib/site";

// Default social preview for pages without their own image (product,
// category and collection pages set one from their photos)
export const alt = `${SITE_NAME} | ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
	const logo = await readFile(
		join(process.cwd(), "public/logo/vaelore-logo-stacked-ink.svg"),
	);
	const logoSrc = `data:image/svg+xml;base64,${logo.toString("base64")}`;

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
					background: "#f6f2ea",
					color: "#14181f",
					fontFamily: "serif",
				}}
			>
				<img src={logoSrc} alt="" width={760} height={289} />
				<div
					style={{
						marginTop: 28,
						width: 96,
						height: 1,
						background: "#846432",
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
