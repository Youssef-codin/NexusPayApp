import { createFileRoute } from '@tanstack/react-router';
import { useAuthStore } from '#/store/auth-store';
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card';

export const Route = createFileRoute('/_auth/profile')({
  component: Profile,
});

function Profile() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-black uppercase tracking-tight">Profile</h1>
        <p className="text-neutral-600 font-medium">No user data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-black uppercase tracking-tight">Profile</h1>
      <Card className="border-2 border-black bg-white shadow-[4px_4px_0px_#000000] max-w-md">
        <CardHeader className="border-b-2 border-black">
          <CardTitle className="text-lg font-bold text-black uppercase tracking-wider">
            User Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-neutral-600 font-medium uppercase tracking-wider">
                Full Name
              </p>
              <p className="font-bold text-black">{user.full_name}</p>
            </div>
            <div>
              <p className="text-sm text-neutral-600 font-medium uppercase tracking-wider">Email</p>
              <p className="font-bold text-black">{user.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
