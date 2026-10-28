const paths = {
  menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'M6 18L18 6M6 6l12 12',
  phone:
    'M2 3.5A1.5 1.5 0 013.5 2h2.6a1 1 0 01.95.68l1 3a1 1 0 01-.29 1.05L6.4 11.2a13 13 0 006.4 6.4l1.47-1.36a1 1 0 011.05-.29l3 1a1 1 0 01.68.95v2.6A1.5 1.5 0 0120.5 22A18.5 18.5 0 012 3.5z',
  mail: 'M3 6.5A1.5 1.5 0 014.5 5h15A1.5 1.5 0 0121 6.5v11A1.5 1.5 0 0119.5 19h-15A1.5 1.5 0 013 17.5v-11zM3.5 6.5L12 13l8.5-6.5',
  mapPin: 'M12 21s7-5.6 7-11a7 7 0 10-14 0c0 5.4 7 11 7 11zm0-8.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  clock: 'M12 22a10 10 0 100-20 10 10 0 000 20zm0-14v4l3 2',
  calendar: 'M4 6.5A1.5 1.5 0 015.5 5h13A1.5 1.5 0 0120 6.5v13A1.5 1.5 0 0118.5 21h-13A1.5 1.5 0 014 19.5v-13zM4 10h16M8 3v4M16 3v4',
  users:
    'M17 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9.5 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM22 21v-2a4 4 0 00-3-3.87M16 4.13a4 4 0 010 7.75',
  book: 'M4 4.5A1.5 1.5 0 015.5 3H19v18H5.5A1.5 1.5 0 014 19.5v-15zM4 17.5h15',
  megaphone: 'M3 11v3l11 5V6L3 11zm11 1.5l6-3v6l-6-3zM7 13v4.5a1.5 1.5 0 003 0V15',
  arrowRight: 'M5 12h14m-6-6l6 6-6 6',
  check: 'M20 6L9 17l-5-5',
  checkCircle: 'M22 11.1V12a10 10 0 11-5.9-9.1M22 4L12 14l-3-3',
  alert: 'M12 9v4m0 3.5v.5M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z',
  info: 'M12 22a10 10 0 100-20 10 10 0 000 20zm0-11v5m0-8.5v.5',
  inbox:
    'M22 12h-6l-2 3h-4l-2-3H2m20 0l-3.2-7A2 2 0 0017 4H7a2 2 0 00-1.8 1L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6z',
  search: 'M21 21l-4.35-4.35M17 10.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z',
  sun: 'M12 17.5a5.5 5.5 0 100-11 5.5 5.5 0 000 11zM12 2.5V5M12 19v2.5M4.6 4.6L6.4 6.4M17.6 17.6l1.8 1.8M2.5 12H5M19 12h2.5M4.6 19.4L6.4 17.6M17.6 6.4l1.8-1.8',
  moon: 'M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z',
  globe: 'M12 22a10 10 0 100-20 10 10 0 000 20zM2.5 12h19M12 2.5a15 15 0 010 19 15 15 0 010-19z',
  shield: 'M12 22s8-3.6 8-10V5l-8-3-8 3v7c0 6.4 8 10 8 10z',
  sparkle: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z',
  target: 'M12 22a10 10 0 100-20 10 10 0 000 20zm0-4a6 6 0 100-12 6 6 0 000 12zm0-4a2 2 0 100-4 2 2 0 000 4z',
  plus: 'M12 5v14M5 12h14',
  edit: 'M4 20h4L20 8l-4-4L4 16v4zM14 6l4 4',
  trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6',
  upload: 'M12 16V4m0 0L8 8m4-4 4 4M4 20h16',
  download: 'M12 4v12m0 0l-4-4m4 4 4-4M4 20h16',
  image: 'M4 5h16v14H4zM4 16l4-4 4 4 3-3 5 5M15 9a1 1 0 100-2 1 1 0 000 2z',
  grid: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
}

export function Icon({ name, className = 'h-5 w-5', strokeWidth = 1.8, label, ...rest }) {
  const d = paths[name]
  if (!d) return null
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      {...rest}
    >
      <path d={d} />
    </svg>
  )
}
