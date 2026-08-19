interface IconProps {
  name: IconName
  size?: number
  className?: string
  strokeWidth?: number
}

export type IconName =
  | 'dashboard'
  | 'products'
  | 'customers'
  | 'invoices'
  | 'payments'
  | 'reports'
  | 'logout'
  | 'switch'
  | 'box'
  | 'people'
  | 'doc'
  | 'wallet'
  | 'chart'
  | 'search'
  | 'plus'
  | 'alert'
  | 'eye'
  | 'eyeOff'
  | 'close'
  | 'check'
  | 'chevLeft'
  | 'chevRight'
  | 'chevDown'

const paths: Record<IconName, string> = {
  dashboard:
    'M3.5 3.5h7v7h-7v-7zm10 0h7v7h-7v-7zm-10 10h7v7h-7v-7zm10 0h7v7h-7v-7z',
  products:
    'M11 3.5L3.5 7.5v9L11 20.5l7.5-4v-9L11 3.5zM11 20.5v-9M3.5 7.5L11 11.5l7.5-4M18.5 16.5v-9',
  customers:
    'M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 2c-2.7 0-8 1.3-8 4v2h16v-2c0-2.7-5.3-4-8-4z',
  invoices:
    'M14 2.5H6.5c-1.1 0-2 .9-2 2v15c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7.5L14 2.5zM14 8h4.5M13 3.5V9h5M8.5 13h7M8.5 16.5h7',
  payments:
    'M20 6H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H4V8h16v8zm-8-7c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3zm10 5v4c0 1.1-.9 2-2 2H4v-2h16v-4h2z',
  reports:
    'M4.5 20h15v-1.5h-15V20zM6 14h2.5V19H6V14zm4.75-4.5h2.5V19h-2.5V9.5zM15.5 5h2.5v14h-2.5V5z',
  logout:
    'M10.5 5.5h-5v13h5V20h-5c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h5v1.5zM17 7.5l-1.1 1.1 1.9 1.9H9v1.5h8.8l-1.9 1.9L17 15l4.5-4.5L17 7.5z',
  switch:
    'M6.5 12.5L3 16l3.5 3.5V17h8v-2h-8v-2.5zM21 8l-3.5-3.5V7h-8v2h8v2.5L21 8z',
  box:
    'M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.12-.36.18-.57.18s-.41-.06-.57-.18l-7.9-4.44c-.32-.17-.53-.5-.53-.88V13c0-.38.21-.71.53-.88l7.9-4.44c.16-.12.36-.18.57-.18s.41.06.57.18l7.9 4.44c.32.17.53.5.53.88v3.5zM4.5 13.1l7.5 4.2 7.5-4.2L12 8.9 4.5 13.1z',
  people:
    'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
  doc:
    'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z',
  wallet:
    'M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z',
  chart:
    'M5 9.2h3V19H5V9.2zM10.6 5h2.8v14h-2.8V5zm5.6 8H19v6h-2.8v-6z',
  search:
    'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
  plus: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
  alert:
    'M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z',
  eye:
    'M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  eyeOff:
    'M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4 4l16 16',
  close: 'M18 6 6 18M6 6l12 12',
  check: 'M20 6 9 17l-5-5',
  chevLeft: 'M15 5l-7 7 7 7',
  chevRight: 'm9 18 6-6-6-6',
  chevDown: 'm6 9 6 6 6-6',
}

export default function Icon({ name, size = 24, className, strokeWidth = 2.5 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[name]} />
    </svg>
  )
}
