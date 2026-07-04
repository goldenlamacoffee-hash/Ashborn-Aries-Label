import { adminListMessages } from '@/app/actions/admin'
import { AdminPageHeader } from '@/components/admin/admin-ui'
import { MessagesManager } from '@/components/admin/messages-manager'

export default async function AdminMessagesPage() {
  const messages = await adminListMessages()

  return (
    <div>
      <AdminPageHeader
        title="Messages"
        description="Contact form submissions from the public site."
      />
      <MessagesManager
        messages={messages.map((m) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          subject: m.subject,
          message: m.message,
          read: m.read,
          createdAt: m.createdAt.toISOString(),
        }))}
      />
    </div>
  )
}
