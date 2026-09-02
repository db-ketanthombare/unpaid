import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="main-footer" role="contentinfo">
      <div className="container">
        <div id="block-epsenkaas-theme-config-pages" className="block block-config-pages block-config-pages-block">
          <div className="config-pages config-pages--type-footer config-pages--view-mode-full">
            <div className="footer__top">
              <div className="intro">
                <p className="txt--intro">
                  Unpaid aims to assist companies in a simple, transparent and fast way when their customers do not pay.
                </p>
                <p>
                  <Link to="/en/user/login">Start your claim</Link>
                </p>
              </div>

              <div className="logos">
                <div className="media media--type-image media--view-mode-default image-wrapper">
                  <img
                    src="/assets/unpaid-footer-logos_0.png"
                    width="252"
                    height="105"
                    alt="Unpaid"
                    loading="lazy"
                    className="image-style-site-width"
                  />
                </div>
              </div>
            </div>

            <div className="footer__wrapper">
              <div className="footer--col address">
                <p>
                  Port Arthurlaan 11e<br />
                  9000 Gent<br />
                  <a href="tel:003293963400">+32 9 396 34 00</a>{' '}
                  <a href="mailto:info@unpaid.be">info@unpaid.be</a>
                </p>
              </div>

              <div className="footer--col">
                <ul className="footer__links">
                  <li><a href="/en/whom">For whom?</a></li>
                  <li><a href="/en/why-unpaid">Why Unpaid?</a></li>
                  <li><a href="/en/references">References</a></li>
                  <li><a href="/en/integration-partners">Integration partners</a></li>
                  <li><a href="https://unpaid.be/en/your-invoice-over-time">Check if your invoice is time-barred</a></li>
                </ul>
              </div>

              <div className="footer--col">
                <ul className="footer__links">
                  <li><a href="https://www.facebook.com/unpaidgent/" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                  <li><a href="https://www.linkedin.com/company/unpaid/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                  <li><a href="https://www.instagram.com/_unpaid_/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
                </ul>
              </div>

              <div className="footer--col">
                <ul className="footer__links">
                  <li><a href="/en/disclaimer">Disclaimer</a></li>
                  <li><a href="/en/general-terms-and-conditions">General terms and conditions</a></li>
                  <li><a href="/en/privacy-statement">Privacy policy</a></li>
                  <li><a href="/en/cookie-statement">Cookies</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
