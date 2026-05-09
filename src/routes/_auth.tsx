import { Outlet, createFileRoute } from '@tanstack/react-router';
import { Layout } from '#/components/Layout';
import { ProtectedRoute } from '#/components/ProtectedRoute';

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <ProtectedRoute>
      <Layout>
        <Outlet />
      </Layout>
    </ProtectedRoute>
  );
}
