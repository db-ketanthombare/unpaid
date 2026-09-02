import { PageLayout } from '@/components/layout/PageLayout'
import { Button } from '@/components/ui/Button'
import { useNavigate } from 'react-router-dom'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <PageLayout title="404 - Page Not Found">
      <div className="flex flex-col items-center justify-center gap-4 py-12">
        <h1 className="text-2xl font-bold">404</h1>
        <p className="text-secondary">The page you're looking for doesn't exist.</p>
        <Button variant="primary" onClick={() => navigate('/')}>
          Go Home
        </Button>
      </div>
    </PageLayout>
  )
}
