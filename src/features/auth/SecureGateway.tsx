export function SecureGateway() {
  return (
    <div className="hidden md:block absolute top-8 left-8 md:top-16 md:left-16 select-none pointer-events-none z-0">
      <div
        className="text-5xl md:text-7xl font-bold leading-[0.9] tracking-tighter"
        style={{
          color: 'rgba(156, 163, 175, 0.2)',
          textShadow: `
            0 0 30px rgba(0, 255, 135, 0.5),
            0 0 60px rgba(0, 255, 135, 0.35),
            0 0 100px rgba(0, 255, 135, 0.2)
          `,
        }}
      >
        SECURE
        <br />
        GATEWAY
      </div>
    </div>
  );
}
