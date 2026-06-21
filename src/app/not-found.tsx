'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4 text-center">
      {/* Background decorative elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
      
      {/* Main content card */}
      <div className="relative z-10 w-full max-w-2xl rounded-3xl border border-white/10 bg-background/50 backdrop-blur-xl p-8 shadow-2xl sm:p-12">
        <div className="flex flex-col items-center">
          <div className="relative mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-white/10">
            <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping opacity-20 duration-1000" />
            <FileQuestion className="h-16 w-16 text-primary drop-shadow-md" />
          </div>
          
          <h1 className="mb-2 bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-7xl font-black tracking-tight text-transparent sm:text-9xl">
            404
          </h1>
          
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Page Not Found
          </h2>
          
          <p className="mb-10 max-w-md text-base text-muted-foreground sm:text-lg">
            Whoops! It seems you&apos;ve ventured into the unknown. The page you&apos;re looking for has either moved or doesn&apos;t exist here anymore.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row w-full justify-center">
            <Button 
              variant="outline" 
              size="lg" 
              className="group rounded-full px-8 w-full sm:w-auto" 
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Go Back
            </Button>
            <Link href="/" tabIndex={-1}>
              <Button size="lg" className="group rounded-full px-8 shadow-lg shadow-primary/20 w-full sm:w-auto">
                <Home className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                Return Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
