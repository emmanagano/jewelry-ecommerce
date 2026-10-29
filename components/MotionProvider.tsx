"use client";

import React from "react";
import { MotionConfig } from "framer-motion";

// Honors the visitor's "reduce motion" setting for every Framer animation
export default function MotionProvider({ children }: { children: React.ReactNode }) {
	return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
