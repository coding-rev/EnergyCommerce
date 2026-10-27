import React from 'react'

export default function SiteWrapper({children}: {children: React.ReactNode}) {
  return (
    <div className="site-wrapper">
        {children}
    </div>
  )
}

