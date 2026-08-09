import { Outfit, Instrument_Serif } from "next/font/google";

// Body / UI — Outfit: a modern geometric sans-serif with personality.
// Replaces Inter for the JobScout brand identity.
export const inter = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

// Editorial display — Instrument Serif for pull-quotes and editorial moments.
export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "normal",
  variable: "--font-instrument-serif",
  display: "swap",
});

export const instrumentSerifItalic = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument-serif-italic",
  display: "swap",
});
