import { getInitials, AVATAR_PALETTES } from './constants';

interface AvatarProps {
  name: string;
  size?: number;
}

export function Avatar({ name, size = 44 }: AvatarProps) {
  const { bg, fg } = AVATAR_PALETTES[name.charCodeAt(0) % AVATAR_PALETTES.length];

  return (
    <div
      className="flex shrink-0 items-center justify-center font-bold"
      style={{
        width: size,
        height: size,
        background: bg,
        color: fg,
        fontSize: size * 0.36,
        letterSpacing: '0.02em',
      }}
    >
      {getInitials(name)}
    </div>
  );
}
