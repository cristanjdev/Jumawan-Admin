/**
 * The 3D portrait styles the portfolio hero can show (hero setting "portrait_style"). Keep the ids in
 * sync with convex/heroSettings.ts and the portfolio's src/lib/portrait-styles.ts.
 */
export const PORTRAIT_STYLES = [
  {
    id: "glass_card",
    name: "Parallax glass card",
    description: "Photo on frosted glass with a floating nameplate; layers shift as it tilts.",
  },
  {
    id: "lanyard",
    name: "Developer ID badge",
    description: "A badge on a lanyard that sways and can be grabbed and swung.",
  },
  {
    id: "coin",
    name: "Coin medallion",
    description: "Photo on the front, logo on the back; flips every few seconds.",
  },
  {
    id: "hologram",
    name: "Hologram",
    description: "Cyan projection above a glowing pad, with scanlines and flicker.",
  },
  {
    id: "laptop",
    name: "Laptop mockup",
    description: "A 3D laptop showing the photo in a code editor, with floating code chips.",
  },
  {
    id: "depth",
    name: "3D photo (depth map)",
    description: "The face moves against the background with the cursor. Best with a depth map.",
  },
] as const;

export type PortraitStyle = (typeof PORTRAIT_STYLES)[number]["id"];
export const DEFAULT_PORTRAIT_STYLE: PortraitStyle = "glass_card";

export const isPortraitStyle = (value: string | undefined): value is PortraitStyle =>
  PORTRAIT_STYLES.some((style) => style.id === value);
