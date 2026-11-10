import Link from 'next/link'

const columns = [
  {
    title: 'Shop',
    links: [
      { label: 'New in', href: '/' },
      { label: 'The entire collection', href: '/products' },
      { label: 'Saved for later', href: '/wishlist' },
    ],
  },
  {
    title: 'Collections',
    links: [
      { label: 'Women', href: '/categories/womens-clothing' },
      { label: 'Men', href: '/categories/mens-clothing' },
      { label: 'Sneakers', href: '/categories/sneakers' },
      { label: 'Formal shoes', href: '/categories/formal-shoes' },
      { label: 'Accessories', href: '/categories/accessories' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Your account', href: '/account' },
      { label: 'Your orders', href: '/orders' },
      { label: 'Sign in', href: '/login' },
      { label: 'Create account', href: '/register' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="shop-footer">
      <div className="shop-footer__columns">
        {columns.map(column => (
          <nav aria-label={`Footer ${column.title.toLowerCase()} navigation`} key={column.title}>
            <h2>{column.title}</h2>
            {column.links.map(link => <Link href={link.href} key={link.href}>{link.label}</Link>)}
          </nav>
        ))}
        <div>
          <h2>Cressida</h2>
          <p>Independent spirit.<br />Considered clothing.</p>
          <p>From Thunder Bay, Canada.</p>
          <a href="#page-top">Back to the top</a>
        </div>
      </div>
      <Link href="/" className="shop-footer__wordmark" aria-label="Cressida home">Cressida</Link>
    </footer>
  )
}
