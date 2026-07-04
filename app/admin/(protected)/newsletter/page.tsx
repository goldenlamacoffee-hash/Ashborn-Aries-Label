import { adminListSubscribers } from '@/app/actions/admin'
import { AdminPageHeader } from '@/components/admin/admin-ui'
import { SubscribersManager } from '@/components/admin/subscribers-manager'

export default async function AdminNewsletterPage() {
  const subscribers = await adminListSubscribers()

  return (
    <div>
      <AdminPageHeader
        title="Newsletter"
        description="Everyone who joined the herd through the signup form."
      />
      <SubscribersManager
        subscribers={subscribers.map((s) => ({
          id: s.id,
          email: s.email,
          createdAt: s.createdAt.toISOString(),
        }))}
      />
    </div>
  )
}
