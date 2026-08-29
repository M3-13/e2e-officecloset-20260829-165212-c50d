import { Link, NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/wardrobe", label: "Garderobe" },
  { to: "/outfits", label: "Outfits" },
  { to: "/creator", label: "Creator" },
  { to: "/account", label: "Konto" },
];

export default function Layout() {
  return (
    <div className="app-shell">
      <header className="navbar">
        <div className="navbar__inner">
          <Link to="/wardrobe" className="navbar__logo">
            Glamour Garderobe
          </Link>
          <nav className="nav-links" aria-label="Hauptnavigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive ? "nav-link nav-link--active" : "nav-link"
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="main">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="footer__inner">
          <span className="footer__brand">Glamour Garderobe</span>
          <nav className="footer__links" aria-label="Rechtliches">
            <Link to="/impressum" className="footer__link">
              Impressum
            </Link>
            <Link to="/datenschutz" className="footer__link">
              Datenschutz
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
