function Hero() {
  return (
    <section className="hero">
      <div className="container hero-layout">
        <div className="hero-copy">
          <p className="eyebrow">New Arrivals 2026</p>
          <h1>Premium tech picks for work, play, and everything between.</h1>
          <p>
            Discover curated electronics with transparent pricing and quick cart
            experience built for modern shopping.
          </p>
          <a className="btn btn-primary" href="#catalog">
            Explore Products
          </a>
        </div>
        <div className="hero-panel" aria-hidden="true">
          <p>⚡</p>
          <p>Curated, trusted, and launch-ready.</p>
        </div>
      </div>
    </section>
  );
}

export default Hero;
