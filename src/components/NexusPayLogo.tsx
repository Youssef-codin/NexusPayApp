import type { FC } from "react";

export type NexusPayLogoType = "icon" | "wordmark" | "full";

interface NexusPayLogoProps {
  size?: number;
  type?: NexusPayLogoType;
  className?: string;
}

export const ICON_BACKGROUND = "#000000";
export const ICON_RING = "#000000";
export const ICON_CENTER_DOT = "#000000";
export const TEXT_NEXUS = "#000000";
export const TEXT_PAY = "#00ff87";

const Mark: FC<{ size: number; className?: string }> = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="2"
      y="2"
      width="20"
      height="20"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M7 17 L7 7 L17 17 L17 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="miter"
    />
  </svg>
);

const Wordmark: FC<{ height: number }> = ({ height }) => (
  <svg
    height={height}
    viewBox="0 0 100 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <text
      x="0"
      y="24"
      fontFamily="Geist, system-ui, -apple-system, sans-serif"
      fontSize="24"
      fontWeight="700"
      letterSpacing="0.2em"
      fill="currentColor"
    >
      NEXUS
    </text>
  </svg>
);

const Full: FC<{ size: number }> = ({ size }) => (
  <div style={{ display: "flex", alignItems: "center", gap: size * 0.2 }}>
    <Mark size={size} />
    <Wordmark height={size * 0.65} />
  </div>
);

export const NexusPayLogo: FC<NexusPayLogoProps> = ({
  size = 48,
  type = "full",
  className,
}) => {
  switch (type) {
    case "icon":
      return <Mark size={size} className={className} />;
    case "wordmark":
      return <Wordmark height={size * 0.65} />;
    case "full":
    default:
      return <Full size={size} />;
  }
};

export const NexusPayMark = (props: Omit<NexusPayLogoProps, "type">) => (
  <NexusPayLogo {...props} type="icon" />
);
export const NexusPayWordmark = (props: Omit<NexusPayLogoProps, "type">) => (
  <NexusPayLogo {...props} type="wordmark" />
);
