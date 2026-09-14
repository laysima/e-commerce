import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="atelier-footer">
      <div className="atelier-footer__top">
        <div className="atelier-footer__intro"><p>Independent spirit.<br />Considered clothing.</p><span>A wardrobe with a point of view.<br />From Thunder Bay, Canada.</span></div>
        <nav aria-label="Footer collection navigation"><p>Find your feeling</p><Link href="/products">The entire collection</Link><Link href="/categories/womens-clothing">Women</Link><Link href="/categories/mens-clothing">Men</Link><Link href="/categories/sneakers">Footwear</Link><Link href="/categories/accessories">Objects</Link></nav>
        <nav aria-label="Footer account navigation"><p>Make yourself at home</p><Link href="/account">Your account</Link><Link href="/orders">Your orders</Link><Link href="/wishlist">Saved for later</Link></nav>
        <a href="#page-top" className="atelier-footer__up">Back to the top</a>
      </div>
      <Link href="/" className="atelier-footer__wordmark" aria-label="Cressida home">cressida<span>.</span></Link>
      <div className="atelier-footer__bottom"><p>© Cressida</p><p>Good form. Great instinct.</p><p>Canada / CAD</p></div>
    </footer>
  )
}
