'use client'

import { useRouter } from 'next/navigation'
import { adminDeleteSubscriber } from '@/app/actions/admin'
import { AdminTable } from '@/components/admin/admin-ui'

type SubscriberRow = { id: number; email: string; createdAt: string }

export function SubscribersManager({ subscribers }: { subscribers: SubscriberRow[] }) {
  const router = useRouter()

  function exportCsv() {
    const csv = ['email,subscribed_at', ...subscribers.map((s) => `${s.email},${s.createdAt}`)].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'newsletter-subscribers.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Remove this subscriber?')) return
    await adminDeleteSubscriber(id)
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {subscribers.length} subscriber{subscribers.length === 1 ? '' : 's'}.
        </p>
        {subscribers.length > 0 && (
          <button
            type="button"
            onClick={exportCsv}
            className="border border-border px-5 py-2.5 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            Export CSV
          </button>
        )}
      </div>

      {subscribers.length === 0 ? (
        <p className="border border-border bg-card p-6 text-sm text-muted-foreground">
          No subscribers yet. Signups from the public site will appear here.
        </p>
      ) : (
        <AdminTable headers={['Email', 'Subscribed', 'Actions']}>
          {subscribers.map((s) => (
            <tr key={s.id}>
              <td className="px-4 py-3 text-foreground">{s.email}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {new Date(s.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => handleDelete(s.id)}
                  className="text-xs uppercase tracking-widest text-ember hover:underline"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}
    </div>
  )
}
