import { createFileRoute } from "@tanstack/react-router"
import { RegisterForm } from "#/features/auth/RegisterForm"
import { DotGrid } from "#/components/DotGrid"
import { useDebouncedHover } from "#/hooks/use-debounced-hover"

export const Route = createFileRoute("/_public/register")({
  component: Register,
})

function Register() {
  const { hovered: cardHovered, hoverHandlers } = useDebouncedHover(120)

  return (
    <div className="min-h-screen bg-[#fcf8ff] relative overflow-hidden flex items-center justify-center">
      <div className="absolute top-8 left-8 md:top-16 md:left-16 select-none pointer-events-none z-0">
        <div
          className="text-5xl md:text-7xl font-bold leading-[0.9] tracking-tighter"
          style={{
            color: "rgba(156, 163, 175, 0.2)",
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

      <DotGrid
        dotSize={5}
        gap={36}
        baseColor="#D4D0DB"
        activeColor="#00ff87"
        proximity={120}
        shockRadius={250}
        shockStrength={5}
        resistance={750}
        returnDuration={1.5}
        disabled={cardHovered}
      />

      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[400px] h-[600px] bg-gradient-to-bl from-purple-200/60 via-pink-100/40 to-transparent rounded-l-full blur-[80px] pointer-events-none z-1" />
      <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-[#00ff87]/10 rounded-full blur-[100px] pointer-events-none z-[1]" />

      <div
        className="relative z-10 w-full max-w-[420px] mx-4"
        {...hoverHandlers}
      >
        <div className="bg-white border-2 border-black shadow-[6px_6px_0px_#000000]">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
