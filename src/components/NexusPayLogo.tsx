import type { FC } from "react";

export type NexusPayLogoType = "icon" | "wordmark" | "full";

interface NexusPayLogoProps {
  size?: number;
  type?: NexusPayLogoType;
}

export const ICON_BACKGROUND = "#2C2C2A";
export const NODE_GREEN = "#1D9E75";
export const NODE_BLUE = "#378ADD";
export const NODE_CORAL = "#D85A30";
export const TEXT_NEXUS = "#2C2C2A";
export const TEXT_PAY = "#888780";

const Mark: FC<{ size: number }> = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="48" height="48" rx="10" fill={ICON_BACKGROUND} />
    <circle cx="14" cy="17" r="4" fill={NODE_GREEN} />
    <circle cx="24" cy="32" r="4" fill={NODE_BLUE} />
    <circle cx="34" cy="17" r="4" fill={NODE_CORAL} />
    <line
      x1="14"
      y1="17"
      x2="24"
      y2="32"
      stroke="white"
      strokeWidth="1"
      strokeOpacity="0.4"
    />
    <line
      x1="24"
      y1="32"
      x2="34"
      y2="17"
      stroke="white"
      strokeWidth="1"
      strokeOpacity="0.4"
    />
    <line
      x1="14"
      y1="17"
      x2="34"
      y2="17"
      stroke="white"
      strokeWidth="1"
      strokeOpacity="0.3"
      strokeDasharray="3 3"
    />
  </svg>
);

const Wordmark: FC<{ height: number }> = ({ height }) => (
  <svg
    height={height}
    viewBox="0 0 160 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <text
      x="0"
      y="24"
      fontFamily="system-ui, -apple-system, sans-serif"
      fontSize="24"
      fontWeight="700"
      letterSpacing="-0.5"
      fill={TEXT_NEXUS}
    >
      Nexus
    </text>
    <text
      x="88"
      y="24"
      fontFamily="system-ui, -apple-system, sans-serif"
      fontSize="24"
      fontWeight="300"
      letterSpacing="-0.5"
      fill={TEXT_PAY}
    >
      Pay
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
}) => {
  switch (type) {
    case "icon":
      return <Mark size={size} />;
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

