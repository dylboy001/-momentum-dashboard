import { SignUp } from '@clerk/nextjs'
import { NavBar } from '@/components/dashboard/NavBar'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-zinc-100">
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-violet-600/[0.05] blur-3xl" />
        <div className="absolute bottom-0 right-1/3 h-[400px] w-[500px] rounded-full bg-violet-900/[0.04] blur-3xl" />
      </div>
      <NavBar />
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12">
        <SignUp />
      </main>
    </div>
  )
}
