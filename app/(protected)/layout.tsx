import Sidebar from '@/components/Sidebar'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <Sidebar>{children}</Sidebar>
}
