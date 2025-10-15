import CreateStoryPage from '@/components/CreateStoryPage';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Home() {
  return (
    <ProtectedRoute>
      <CreateStoryPage />
    </ProtectedRoute>
  );
}
