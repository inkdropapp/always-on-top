import type React from 'react'
import { memo } from 'react'

interface AlwaysOnTopIconProps extends React.SVGProps<SVGSVGElement> {
  title?: string
  titleId?: string
}

export const AlwaysOnTopIcon = memo(({ title, titleId, ...props }: AlwaysOnTopIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="16"
    height="16"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <line
      x1="12"
      y1="5.248"
      x2="12"
      y2="23.248"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <polyline
      points="8.25 8.998 12 5.248 15.75 8.998"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="0.75"
      y1="0.748"
      x2="23.25"
      y2="0.748"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
))
