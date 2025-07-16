export function H1({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <h1 className={`scroll-m-20 text-4xl font-bold tracking-tight text-balance ${className || ""}`}>
      {children}
    </h1>
  )
}

export function H2({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <h2 className={`scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 ${className || ""}`}>
      {children}
    </h2>
  )
}

export function H3({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <h3 className={`scroll-m-20 text-2xl font-semibold tracking-tight ${className || ""}`}>
      {children}
    </h3>
  )
}

export function H4({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <h4 className={`scroll-m-20 text-xl font-semibold tracking-tight ${className || ""}`}>
      {children}
    </h4>
  )
}

export function P({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <p className={`leading-7 ${className || ""}`}>
      {children}
    </p>
  )
}

export function Blockquote({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <blockquote className={`mt-6 border-l-2 pl-6 italic ${className || ""}`}>
      {children}
    </blockquote>
  )
}

export function Muted({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <p className={`text-muted-foreground text-sm ${className || ""}`}>{children}</p>
  )
}

export function Small({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <p className={`text-sm text-muted-foreground ${className || ""}`}>{children}</p>
  )
}

