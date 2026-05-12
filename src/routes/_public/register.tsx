import { createFileRoute } from '@tanstack/react-router';
import { RegisterForm } from '#/features/auth/RegisterForm';
import { DotGrid } from '#/components/DotGrid';
import { useDebouncedHover } from '#/hooks/use-debounced-hover';
import { SecureGateway } from '#/features/auth/SecureGateway';

export const Route = createFileRoute('/_public/register')({
  component: Register,
});

function Register() {
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

      <div className="relative z-10 w-full max-w-[420px] mx-4" {...hoverHandlers}>
        <div className="bg-white border-2 border-black shadow-[6px_6px_0px_#000000]">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
