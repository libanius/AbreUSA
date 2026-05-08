import LogoutButton from "./_components/logout-button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold tracking-widest text-green-700 uppercase">AbreUSA</span>
          <span className="ml-3 text-sm text-gray-500">Admin Portal</span>
        </div>
        <LogoutButton />
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
