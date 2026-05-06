import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "#/features/auth/LoginForm";
import { DotGrid } from "#/components/DotGrid";
import { useDebouncedHover } from "#/hooks/use-debounced-hover";
import { SecureGateway } from "#/features/dashboard/SecureGateway";

export const Route = createFileRoute("/_public/login")({
  component: Login,
});

function Login() {
  const { hovered: cardHovered, hoverHandlers } = useDebouncedHover(120);

  return (
    <div className="min-h-screen bg-[#fcf8ff] relative overflow-hidden flex items-center justify-center">
      <SecureGateway />

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

      <div
        className="relative z-10 w-full max-w-[420px] mx-4"
        {...hoverHandlers}
      >
        <div className="bg-white border-2 border-black shadow-[6px_6px_0px_#000000]">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
