'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4 text-center">
      {/* Background decorative elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-destructive/5 rounded-full blur-3xl -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-destructive/10 rounded-full blur-3xl -z-10 animate-pulse" />
      
      {/* Main content card */}
      <div className="relative z-10 w-full max-w-2xl rounded-3xl border border-white/10 bg-background/50 backdrop-blur-xl p-8 shadow-2xl sm:p-12">
        <div className="flex flex-col items-center">
          <div className="relative mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-destructive/20 to-destructive/5 ring-1 ring-white/10">
            <div className="absolute inset-0 rounded-full bg-destructive/10 animate-ping opacity-20 duration-1000" />
            <AlertTriangle className="h-16 w-16 text-destructive drop-shadow-md" />
          </div>
          
          <h1 className="mb-2 bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-5xl font-black tracking-tight text-transparent sm:text-7xl">
            Oops!
          </h1>
          
          <h2 className="mb-4 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Something went wrong
          </h2>
          
          <p className="mb-10 max-w-md text-base text-muted-foreground sm:text-lg">
            An unexpected error has occurred on our end. We&apos;ve been notified and are actively looking into it.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row w-full justify-center">
            <Link href="/" tabIndex={-1}>
              <Button variant="outline" size="lg" className="group rounded-full px-8 w-full sm:w-auto">
                <Home className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                Go Home
              </Button>
            </Link>
            <Button 
              size="lg" 
              className="group rounded-full px-8 shadow-lg bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-destructive/20 w-full sm:w-auto" 
              onClick={() => reset()}
            >
              <RefreshCcw className="mr-2 h-4 w-4 transition-transform group-hover:rotate-180 duration-500" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
