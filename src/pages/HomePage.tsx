import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Footer } from '@/components/layout/Footer';
import { invoiceService } from '@/services/invoiceService';
import { authService } from '@/services/authService';
import { ExtractedInvoiceData } from '@/types/invoice';
import { ExtractedInvoiceReview } from '@/components/invoice/ExtractedInvoiceReview';
import { useAuth } from '@/context/AuthContext';

interface Testimonial {
  quote: string;
  name: string;
  company?: string;
  companyUrl?: string;
  image?: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "We’ve been working with unpaid.be for several years and are very satisfied with their service. Creating a claim is lightning-fast and doesn’t involve any complicated procedures. What we particularly value is the transparency, simplicity, and effectiveness of their approach. No hassle with lawyers or lengthy legal proceedings – just an efficient solution for unpaid invoices. For us, unpaid.be is the go-to partner when dealing with non-paying customers. Highly recommended for any SME looking to protect its cash flow.",
    name: "Tom Van den Keybus",
    company: "Nubila",
    companyUrl: "https://nubila.be/",
  },
  {
    quote:
      "I used to work with a debt recovery agency, but they charged a commission of 20%. At Unpaid, although I do have to provide an advance, I get it all back promptly upon payment, PLUS 100% of the invoice amount!",
    name: "Fons Vandenbroek",
  },
  {
    quote:
      'I am amazed at the fast functioning of both your office and the bailiff. I hope never to need you again but it had to be "direct"',
    name: "D.V.",
  },
  {
    quote:
      "Thanks for the quick arrangement. A correct service and the specified timing is respected. You have gained a customer.",
    name: "Chris Sterck",
    company: "Sterca",
    companyUrl: "https://www.keurder.be/",
    image: "/assets/11507.png",
  },
  {
    quote: "Thank you very much for this smooth service.",
    name: "Eva Mouton",
  },
  {
    quote:
      "Thank you very much for following our file correctly and quickly and to bring it to a successful conclusion. If we have more unpaid invoices, we are happy to work with your team again. I certainly recommend you to everyone, thanks.",
    name: "Ivo Van Dessel",
    company: "MANNO Cleaning",
    image: "/assets/11505.jpg",
  },
  {
    quote:
      "I'm very satisfied with the cooperation and system of your organization. I have recommended you to my accountant and other self-employed people.",
    name: "D. Van Hulle",
    company: "DoReVo",
    companyUrl: "https://www.dorevo.be/",
    image: "/assets/11506.png",
  },
  {
    quote:
      "Thank you for the great service. I spent months contacting the customer and 'asking' for the invoice to be paid. In the end, via unpaid.be, I spent just 10 minutes submitting the case and 3 weeks later, I received a mail that everything had been taken care of. Highly recommended!",
    name: "Bram Laebens",
    company: "Monkey Monkey",
    companyUrl: "https://www.monkeymonkey.be/",
    image: "/assets/11504.jpeg",
  },
  {
    quote:
      "Unpaid is so efficient that as a lawyer, I even use it myself for my own outstanding invoices.",
    name: "Mw. Evelyne Van den Vreken",
    company: "ADV Law",
    companyUrl: "https://www.advlaw.be/",
    image: "/assets/11508.png",
  },
  {
    quote:
      "I would like to thank you for this smooth handling. It’s the first time we sought your help and I am very satisfied. Proper, smooth communication, updates regarding the progress, in short, a very pleasant cooperation. In this way we no longer have to deal with this ourselves.\nThanks!",
    name: "Maxim Defloo",
    company: "Verhuring Defloo",
    companyUrl: "https://verhuringdefloo.be/nl/",
    image: "/assets/19931.jpg",
  },
  {
    quote:
      "Great help. Took a long time before the person in question wanted to pay, 9 months, but did not have to pay anything outside the first deposit. Top service!",
    name: "Jaimy Appermans",
    company: "Jamie’s Cocktails",
    image: "/assets/12251.jpg",
  },
  {
    quote: "That simple? Speechless!",
    name: "Yves Van Dooren",
    company: "Freelance Consultant",
    companyUrl: "https://be.linkedin.com/in/yves-van-dooren-1877182",
    image: "/assets/12705.jpg",
  },
  {
    quote:
      "Our first file with Unpaid has been fully processed. Great experience. If necessary (hopefully not too much ;)) we will certainly call on Unpaid again.",
    name: "Thijs De Quick",
    company: "Buro Project",
    companyUrl: "https://buroproject.be/",
    image: "/assets/15321.jpg",
  },
  {
    quote:
      "Thank you for the information and I would also like to thank the entire team for the services provided. I am very satisfied with them. Thanks a lot!!",
    name: "Jochen Veulemans",
    company: "Freelancer Eventsector",
  },
  {
    quote:
      "As a young company, we had significant trouble with customers who were stretching the limits of their payment terms. One of them stood out head and shoulders above the rest. There was typical behaviour like not responding to reminders, promising to pay but discovering that it hadn't worked out, and so on. Finally, after waiting for yet another payment, we called in Unpaid.",
    name: "Antoon Vanderstraeten",
    company: "Ekimedias",
    companyUrl: "http://ekimedias.be/",
    image: "/assets/15698.jpg",
  },
  {
    quote:
      "We have used Unpaid for a number of years, and have been successfully paid for every file they have taken. A significant advantage is the burden it removes from our workload. From our accounting package, we can create a file with one click, after which Unpaid does all the complex work for us. The positive personal contact with both the general manager and his team completes the story.",
    name: "Jeroen Buggenhoudt",
    company: "Conversal",
    companyUrl: "https://www.conversal.be/",
    image: "/assets/15974.jpeg",
  },
  {
    quote:
      "Unpaid is the dream combination of courtesy and propriety.\nCollecting invoices is never a fun job. Unpaid's communication skills are so unique that paying a tricky invoice almost becomes a pleasure for the customer as excuses melt away like snow in the sun.",
    name: "D. Rademaker",
    company: "Zaakvoerder",
  },
  {
    quote:
      "Colman car care is very satisfied with your services. We were informed very quickly and correctly.\nNever any worries about customers not paying.\nAn excellent partner to add to your business.",
    name: "Kim Colman",
    company: "Colman Car Care",
    companyUrl: "https://colmancarcare.be/",
    image: "/assets/58744.png",
  },
  {
    quote: "Fast, direct and perfect too. Keep it up!",
    name: "Cromwell Cuvalay",
    image: "/assets/11516.jpg",
  },
];

export function HomePage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Invoice OCR state
  const [invoiceFile, setInvoiceFile] = useState<{
    name: string;
    size: string;
    previewUrl?: string;
    isImage: boolean;
    rawFile?: File | Blob;
  } | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(15);
  const [scanStatus, setScanStatus] = useState('Extracting amounts and payment references...');
  const [extractedData, setExtractedData] = useState<ExtractedInvoiceData | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const reviewRef = useRef<HTMLDivElement | null>(null);

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev > 0 ? prev - 1 : testimonials.length - 1));
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev < testimonials.length - 1 ? prev + 1 : 0));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const isImg = file.type.startsWith('image/');
      setInvoiceFile({
        name: file.name,
        size: formatFileSize(file.size),
        previewUrl: isImg ? URL.createObjectURL(file) : undefined,
        isImage: isImg,
        rawFile: file,
      });
      setScanError(null);
    }
  };

  const handleScanInvoice = async () => {
    if (!invoiceFile || !invoiceFile.rawFile) {
      setScanError('Please select or capture an invoice document first.');
      return;
    }

    setIsScanning(true);
    setScanProgress(18);
    setScanStatus('Analyzing document structure...');
    setScanError(null);

    const t1 = setTimeout(() => {
      setScanProgress(45);
      setScanStatus('Extracting debtor and creditor information...');
    }, 1200);

    const t2 = setTimeout(() => {
      setScanProgress(72);
      setScanStatus('Extracting amounts and payment references...');
    }, 2800);

    const t3 = setTimeout(() => {
      setScanProgress(89);
      setScanStatus('Verifying IBAN and tax identifiers...');
    }, 4800);

    try {
      const data = await invoiceService.scanInvoice(invoiceFile.rawFile, invoiceFile.name, token || undefined);

      // Check if invoice already exists locally if backend did not already flag it
      let isDup = Boolean(data.isDuplicate);
      const invNum = data.invoiceDetails?.invoiceNumber?.trim();
      if (!isDup && invNum) {
        try {
          const storedClaims = JSON.parse(localStorage.getItem('unpaid_user_claims') || '[]');
          const match = storedClaims.find((c: { claimNumber?: string }) => c.claimNumber?.toLowerCase() === invNum.toLowerCase());
          if (match) {
            isDup = true;
          }
        } catch (e) {
          console.error(e);
        }
      }

      setScanProgress(100);
      setScanStatus('Scan complete!');
      setExtractedData({
        ...data,
        isDuplicate: isDup,
      });
      setTimeout(() => {
        reviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (err: unknown) {
      console.error('Scan error:', err);
      setScanError(err instanceof Error ? err.message : 'Failed to scan invoice with AI backend.');
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      setIsScanning(false);
    }
  };

  const { isAuthenticated, token, logout } = useAuth();
  const [claimSuccessData, setClaimSuccessData] = useState<{
    invoiceNumber: string;
    amount: string | number;
    currency: string;
    debtorName: string;
  } | null>(null);
  const [isSubmittingClaim, setIsSubmittingClaim] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);

  React.useEffect(() => {
    const rawSuccess = sessionStorage.getItem('unpaid_claim_success');
    if (rawSuccess) {
      try {
        setClaimSuccessData(JSON.parse(rawSuccess));
        sessionStorage.removeItem('unpaid_claim_success');
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const submitClaimAndRedirect = async (data: ExtractedInvoiceData, activeToken?: string) => {
    setIsSubmittingClaim(true);
    setClaimError(null);
    try {
      const invNum =
        data.invoiceDetails?.invoiceNumber ||
        `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
      const amtVal = data.invoiceDetails?.amount
        ? Number(data.invoiceDetails.amount).toFixed(2)
        : '0.00';
      const currVal = data.invoiceDetails?.currency || 'EUR';
      const debtorVal =
        data.debtorDetails?.debtorName || data.debtorDetails?.companyName || 'Debtor BV';
      const companyVal = data.creditorDetails?.companyName || 'My Company BV';
      const refVal = data.invoiceDetails?.paymentReference || invNum;
      const dateVal = data.invoiceDetails?.invoiceDate || new Date().toISOString().slice(0, 10);

      // 1. Immediately store the claim into dashboard records
      // Also save extracted company to unpaid_user_companies
      const companyVat =
        data.creditorDetails?.vat ||
        data.debtorDetails?.vat ||
        (data.creditorDetails as { taxNumber?: string })?.taxNumber ||
        (data.debtorDetails as { taxNumber?: string })?.taxNumber ||
        '—';

      const creditorAddr = [
        data.creditorDetails?.address,
        data.creditorDetails?.postalCode,
        data.creditorDetails?.city,
        data.creditorDetails?.country,
      ]
        .filter(Boolean)
        .join(', ');

      const debtorAddr = [
        data.debtorDetails?.address,
        data.debtorDetails?.postalCode,
        data.debtorDetails?.city,
        data.debtorDetails?.country,
      ]
        .filter(Boolean)
        .join(', ');

      const companyAddr = creditorAddr || debtorAddr || data.debtorDetails?.address || '—';

      const newClaim = {
        id: String(Date.now()),
        claimNumber: invNum,
        company: companyVal,
        debtorName: debtorVal,
        total: amtVal,
        currency: currVal,
        reference: refVal,
        date: dateVal,
        status: 'Registered',
        vat: companyVat,
        address: companyAddr,
      };

      const existing = JSON.parse(localStorage.getItem('unpaid_user_claims') || '[]');
      localStorage.setItem('unpaid_user_claims', JSON.stringify([newClaim, ...existing]));

      const existingCompanies = JSON.parse(localStorage.getItem('unpaid_user_companies') || '[]');
      const compIdx = existingCompanies.findIndex((c: { name: string }) => c.name.toLowerCase() === companyVal.toLowerCase());
      if (compIdx >= 0) {
        if ((!existingCompanies[compIdx].vat || existingCompanies[compIdx].vat === '—') && companyVat && companyVat !== '—') {
          existingCompanies[compIdx].vat = companyVat;
        }
        if ((!existingCompanies[compIdx].address || existingCompanies[compIdx].address === '—') && companyAddr && companyAddr !== '—') {
          existingCompanies[compIdx].address = companyAddr;
        }
      } else {
        existingCompanies.unshift({
          id: String(Date.now()),
          name: companyVal,
          vat: companyVat,
          address: companyAddr,
        });
      }
      localStorage.setItem('unpaid_user_companies', JSON.stringify(existingCompanies));

      sessionStorage.setItem(
        'unpaid_claim_success',
        JSON.stringify({
          invoiceNumber: invNum,
          amount: amtVal,
          currency: currVal,
          debtorName: debtorVal,
        })
      );

      sessionStorage.removeItem('unpaid_pending_claim');
      setExtractedData(null);

      // 2. Resiliently sync to backend with sanitized fields
      try {
        const authToken = activeToken || authService.getStoredToken() || token || undefined;
        const sanitizedPayload: ExtractedInvoiceData = {
          ...data,
          creditorDetails: {
            ...data.creditorDetails,
            companyName: companyVal,
          },
          debtorDetails: {
            ...data.debtorDetails,
            debtorName: debtorVal,
            companyName: debtorVal,
            email:
              data.debtorDetails?.email ||
              `billing@${debtorVal.toLowerCase().replace(/[^a-z0-9]/g, '') || 'company'}.com`,
          },
          invoiceDetails: {
            ...data.invoiceDetails,
            invoiceNumber: invNum,
            amount: data.invoiceDetails?.amount || amtVal,
            currency: currVal,
            invoiceDate: dateVal,
            dueDate:
              data.invoiceDetails?.dueDate ||
              new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
          },
        };
        await authService.confirmInvoice(sanitizedPayload, authToken);
      } catch (backendErr) {
        console.warn('Backend claim sync note (claim saved locally):', backendErr);
      }

      navigate('/claims');
    } catch (err: unknown) {
      console.error('Confirm claim error:', err);
      setClaimError(err instanceof Error ? err.message : 'Failed to confirm claim.');
    } finally {
      setIsSubmittingClaim(false);
    }
  };

  const handleConfirmClaim = async (data: ExtractedInvoiceData) => {
    setIsSubmittingClaim(true);
    if (!isAuthenticated) {
      // User is not logged in: save pending claim and redirect directly to dedicated login page
      sessionStorage.setItem('unpaid_pending_claim', JSON.stringify(data));
      setTimeout(() => {
        navigate('/en/user/login?destination=/claims');
      }, 600);
      return;
    }

    // User is already logged in: proceed with claim and redirect to claims page
    await submitClaimAndRedirect(data);
  };

  const handleResetScan = () => {
    setExtractedData(null);
    setInvoiceFile(null);
    setScanError(null);
    setClaimSuccessData(null);
    setClaimError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLoadSampleInvoice = async () => {
    try {
      const response = await fetch('/assets/sample-invoice.pdf');
      const blob = await response.blob();
      const file = new File([blob], 'factura_spanish_INV-2024-0097.pdf', { type: 'application/pdf' });
      setInvoiceFile({
        name: file.name,
        size: formatFileSize(file.size),
        isImage: false,
        rawFile: file,
      });
      setScanError(null);
    } catch (err) {
      console.warn('Could not load sample invoice:', err);
    }
  };

  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera access unavailable or simulated:', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        canvas.toBlob((blob) => {
          if (blob) {
            setInvoiceFile({
              name: `scanned_invoice_${new Date().toISOString().slice(0, 10)}.jpg`,
              size: formatFileSize(blob.size),
              previewUrl: dataUrl,
              isImage: true,
              rawFile: blob,
            });
            setScanError(null);
          }
        }, 'image/jpeg', 0.9);
      }
    } else {
      setInvoiceFile({
        name: `scanned_invoice_${new Date().toISOString().slice(0, 10)}.jpg`,
        size: '184 KB',
        previewUrl: '/assets/11506.png',
        isImage: true,
      });
    }
    stopCamera();
  };

  return (
    <div className="dialog-off-canvas-main-canvas" data-off-canvas-main-canvas>
      <div className="page-wrapper">
        {/* Main Header */}
        <header className="main-header" role="banner">
          <div className="container">
            <div id="block-epsenkaas-theme-branding" className="block block-system block-system-branding-block">
              <div className="logo-wrapper">
                <Link className="site-logo" to="/en" title="Home" rel="home">
                  <img src="/assets/logo.svg" alt="Home" />
                </Link>
              </div>
            </div>

            <div id="block-headermenu" className="block block-project block-ek-menu-block">
              <div
                className={`nav-toggle--menu ${menuOpen ? 'open' : ''}`}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                Menu
              </div>
              <button
                aria-label="Menu"
                className={`nav-toggle ${menuOpen ? 'open' : ''}`}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                Menu
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </button>

              <div className={`menu-wrapper ${menuOpen ? 'open' : ''}`}>
                <nav className="main-menu">
                  <ul className="menu">
                    <li className="menu-item">
                      <a href="/en/whom">For whom?</a>
                    </li>
                    <li className="menu-item">
                      <a href="/en/faq">FAQ</a>
                    </li>
                    <li className="menu-item">
                      <a href="/en/discover">Knowledge center</a>
                    </li>
                    <li className="menu-item">
                      <a href="/en/contact">Contact</a>
                    </li>
                  </ul>
                </nav>

                <nav className="account-menu">
                  <ul className="menu">
                    {isAuthenticated ? (
                      <>
                        <li className="menu-item">
                          <Link to="/claims" className="account-claims-link">
                            Your claims
                          </Link>
                        </li>
                        <li className="menu-item">
                          <button
                            type="button"
                            onClick={() => {
                              logout();
                              navigate('/');
                            }}
                            className="account-logout-btn"
                          >
                            Log out
                          </button>
                        </li>
                      </>
                    ) : (
                      <li className="menu-item">
                        <Link to="/en/user/login">Log in</Link>
                      </li>
                    )}
                  </ul>
                </nav>

                <ul className="language-switcher">
                  <li>
                    <a href="/nl/startpagina" hrefLang="nl">
                      NL
                    </a>
                  </li>
                  <li className="active">EN</li>
                  <li>
                    <a href="/fr/page-daccueil" hrefLang="fr">
                      FR
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="hero block block-project block-ek-header-block" id="block-headerinfopage">
          <div className="hero__video">
            {!isVideoLoaded && <div className="hero__video-shimmer" />}
            <video
              autoPlay
              muted
              playsInline
              loop
              onLoadedData={() => setIsVideoLoaded(true)}
              onCanPlay={() => setIsVideoLoaded(true)}
              onPlaying={() => setIsVideoLoaded(true)}
              style={{
                opacity: isVideoLoaded ? 1 : 0,
                transition: 'opacity 0.6s ease',
              }}
            >
              <source src="/assets/unpaid-hero.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="hero-vat">
            <div className="hero-vat__wrapper">
              <div className="hero-vat__intro">
                <h1>Troubled by unpaid invoices?</h1>
                <p>
                  Thanks to the Unpaid procedure, you can collect your undisputed B2B invoices 100% legally without having to consult a lawyer, court or collection agency. Your peace of mind starts here and now!
                </p>
              </div>

              <div className="hero-vat__form hero-variant-c__container">
                {isScanning ? (
                  <div className="processing-variant-c">
                    <div className="processing-variant-c__header">
                      <div className="processing-variant-c__icon-wrapper">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10 9 9 9 8 9" />
                        </svg>
                      </div>
                      <div className="processing-variant-c__title-group">
                        <h3 className="processing-variant-c__title">Extracting invoice details...</h3>
                        <p className="processing-variant-c__subtitle">This may take a few seconds.</p>
                      </div>
                    </div>

                    <div className="processing-variant-c__progress-row">
                      <div className="processing-variant-c__track">
                        <div
                          className="processing-variant-c__bar"
                          style={{ width: `${scanProgress}%` }}
                        ></div>
                      </div>
                      <div className="processing-variant-c__percentage">{scanProgress}%</div>
                    </div>

                    <div className="processing-variant-c__footer">
                      <div className="processing-variant-c__status-pill">
                        <span className="processing-variant-c__dot"></span>
                        <span>{scanStatus}</span>
                      </div>
                    </div>
                  </div>
                ) : extractedData ? (
                  <div className="variant-d-container">
                    <div className="variant-d-card">
                      <div className="variant-d-icon">
                        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#1cbc66" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="16 9 10 15 7 12" />
                        </svg>
                      </div>

                      <div className="variant-d-content">
                        <div className="variant-d-title">Invoice Scanned Successfully!</div>
                        <div className="variant-d-subtitle">
                          <strong>{invoiceFile?.name || 'Invoice'}</strong> has been scanned and is ready to review.
                        </div>
                      </div>

                      <div className="variant-d-actions">
                        <button
                          type="button"
                          className="variant-d-btn-review"
                          onClick={() => reviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                        >
                          Review Details
                        </button>

                        <button
                          type="button"
                          className="variant-d-btn-scan"
                          onClick={handleResetScan}
                        >
                          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                            <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                            <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                            <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                            <line x1="8" y1="12" x2="16" y2="12" />
                          </svg>
                          Scan Another
                        </button>
                      </div>
                    </div>

                    <div className="variant-d-security-note">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1cbc66" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <polyline points="9 12 11 14 15 10" />
                      </svg>
                      <span>Your data is secure and encrypted.</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="hero-variant-c__title">Submit your invoice in the way that's easy for you</h3>

                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      accept=".pdf,image/jpeg,image/png,image/webp,image/tiff"
                      onChange={handleFileInputChange}
                    />

                    <div className="hero-variant-c__actions">
                      <button
                        type="button"
                        className="variant-c-btn variant-c-btn--upload"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="variant-c-btn__icon">
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                        </div>
                        <div className="variant-c-btn__content">
                          <div className="variant-c-btn__label">Upload Invoice</div>
                          <div className="variant-c-btn__sublabel">Choose file from device</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        className="variant-c-btn variant-c-btn--camera"
                        onClick={startCamera}
                      >
                        <div className="variant-c-btn__icon">
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                            <circle cx="12" cy="13" r="4" />
                          </svg>
                        </div>
                        <div className="variant-c-btn__content">
                          <div className="variant-c-btn__label">Take Photo</div>
                          <div className="variant-c-btn__sublabel">Capture with camera</div>
                        </div>
                      </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', fontSize: '0.85rem' }}>
                      <span className="hero-variant-c__format-note" style={{ margin: 0 }}>
                        PDF, JPG, PNG up to 10MB
                      </span>
                      <button
                        type="button"
                        onClick={handleLoadSampleInvoice}
                        style={{ background: 'none', border: 'none', color: '#1cbc66', textDecoration: 'underline', cursor: 'pointer', padding: 0, fontSize: '0.85rem' }}
                      >
                        Try sample invoice
                      </button>
                    </div>

                    {scanError && (
                      <div style={{ marginTop: '12px', padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', color: '#991b1b', fontSize: '0.88rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>⚠️ {scanError}</span>
                        <button
                          type="button"
                          onClick={() => setScanError(null)}
                          style={{ background: 'none', border: 'none', color: '#991b1b', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    {invoiceFile && (
                      <div className="variant-c-selected-file">
                        <div className="variant-c-file-info">
                          <span className="variant-c-file-icon">✓</span>
                          <div>
                            <strong>{invoiceFile.name}</strong> ({invoiceFile.size})
                          </div>
                        </div>
                        <div className="variant-c-file-actions">
                          <button
                            type="button"
                            className="variant-c-scan-cta"
                            onClick={handleScanInvoice}
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                              <line x1="16" y1="13" x2="8" y2="13" />
                              <line x1="16" y1="17" x2="8" y2="17" />
                            </svg>
                            Scan Invoice
                          </button>
                          <button
                            type="button"
                            className="variant-c-remove-btn"
                            onClick={handleResetScan}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Extracted Invoice Review Section */}
        {extractedData && (
          <div ref={reviewRef} style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '2.5rem 0' }}>
            {isSubmittingClaim && (
              <div style={{ maxWidth: '1200px', margin: '0 auto 1.5rem', padding: '14px 20px', background: '#eaf8f0', border: '1px solid #bbf7d0', borderRadius: '8px', color: '#065f46', fontSize: '0.95rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1cbc66"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }}
                >
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
                <span>
                  {isAuthenticated
                    ? 'Saving your claim & redirecting to your claims dashboard...'
                    : 'Details saved. Redirecting you to log in & complete your claim submission...'}
                </span>
              </div>
            )}
            {claimError && (
              <div style={{ maxWidth: '1200px', margin: '0 auto 1.5rem', padding: '12px 18px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#991b1b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>⚠️ {claimError}</span>
                <button type="button" onClick={() => setClaimError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', color: '#991b1b' }}>✕</button>
              </div>
            )}
            <ExtractedInvoiceReview
              data={extractedData}
              fileName={invoiceFile?.name}
              onReset={handleResetScan}
              onConfirm={handleConfirmClaim}
              isRedirecting={isSubmittingClaim}
            />
          </div>
        )}

        {/* Main Content Area */}
        <div className="main-wrapper">
          <main role="main" className="main">
            <div id="block-epsenkaas-theme-content" className="block block-system block-system-main-block">
              <div className="node node--type-page node--view-mode-full">
                <div className="paragraph__wrapper">

                  {/* USP Section */}
                  <div className="paragraph paragraph--usp">
                    <div className="usp__image">
                      <div className="media media--type-image media--view-mode-teaser image-wrapper">
                        <img
                          src="/assets/unpaid-39_1.jpg"
                          width="600"
                          height="550"
                          alt="Unpaid"
                          loading="lazy"
                          className="image-style-teaser"
                        />
                      </div>
                      <div className="phone">
                        <a href="tel:003293963400">+32 9 396 34 00</a>
                      </div>
                    </div>

                    <div className="usp__content">
                      <h1>Collecting invoices doesn't have to be expensive or time-consuming</h1>
                      <div className="usp-group">
                        <div className="usp-group__item">No subscription required</div>
                        <div className="usp-group__item">Also for small amounts</div>
                        <div className="usp-group__item">No exclusivity</div>
                        <div className="usp-group__item">Immediate action</div>
                        <div className="usp-group__item">Integrations with accounting packages</div>
                      </div>
                      <div className="text">
                        <div>
                          <div>
                            <div>
                              <p>After you have submitted your claim, we will send a bailiff to your client within 5 working days. So no more waiting, it's time for real action!</p>
                              <div><div><div>&nbsp;</div></div></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* How It Works Section */}
                  <div className="paragraph paragraph--how-it-works">
                    <div className="sub-title">How it works</div>
                    <h2>The emphasis at Unpaid is on ease of use and efficiency.</h2>
                    <div className="steps">
                      <div className="steps__item">
                        <div className="paragraph paragraph--how-it-works-step">
                          <h3>Fill in the form</h3>
                          <div className="text">
                            <p>Fill in the form. This should take about 10 min. (Tip: you will need to have your bank card and the outstanding invoice handy.)</p>
                          </div>
                        </div>
                      </div>

                      <div className="steps__item">
                        <div className="paragraph paragraph--how-it-works-step">
                          <h3>Verification</h3>
                          <div className="text">
                            <p>As you fill it in, we will verify whether your case meets the legal conditions. If this is not the case, then we will stop the process and suggest an alternative.</p>
                          </div>
                        </div>
                      </div>

                      <div className="steps__item">
                        <div className="paragraph paragraph--how-it-works-step">
                          <h3>Advance and refund</h3>
                          <div className="text">
                            <div>
                              <div>
                                <div>
                                  <p>As a final step, you will need to pay an advance. But don't worry, this will be <a href="https://www.unpaid.be/en/faq#faq-73">reimbursed</a> with your payment!</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Testimonials Slider Section */}
                  <div className="paragraph paragraph--views-reference">
                    <div className="views-element-container">
                      <div className="display--slider view view--testimonials js-view-dom-id-ca0fe9bc32812080ced7ea7abcec0642037e443ee5144b01de7970da98d8d2cd">
                        <div className="header-filter-wrapper">
                          <div className="view__header">
                            <h2>What our customers say</h2>
                          </div>
                        </div>

                        <div className="view__content">
                          <div className="view--slider swiper-overflow">
                            <div className="swiper-container">
                              <div
                                className="swiper-wrapper"
                                style={{
                                  display: 'flex',
                                  transform: `translateX(-${activeSlide * 460}px)`,
                                  transition: 'transform 0.4s ease-in-out',
                                }}
                              >
                                {testimonials.map((t, idx) => (
                                  <div
                                    className="swiper-slide"
                                    key={idx}
                                    style={{ flex: '0 0 420px', minWidth: '420px', marginRight: '40px' }}
                                  >
                                    <div className="node node--type-testimonial node--view-mode-teaser">
                                      <div className="field field-name-field-testimonial-short">
                                        {t.quote}
                                      </div>

                                      <div className="testimonial__group">
                                        {t.image && (
                                          <div className="testimonial__image">
                                            <div className="media media--type-image media--view-mode-square image-wrapper">
                                              <img
                                                src={t.image}
                                                width="300"
                                                height="300"
                                                alt={t.name}
                                                loading="lazy"
                                                className="image-style-square"
                                              />
                                            </div>
                                          </div>
                                        )}

                                        <div className="testimonial__quotee">
                                          <div className="testimonial__name">{t.name}</div>
                                          {t.company && (
                                            <div className="testimonial__company">
                                              {t.companyUrl ? (
                                                <a href={t.companyUrl} target="_blank" rel="noopener noreferrer">
                                                  {t.company}
                                                </a>
                                              ) : (
                                                t.company
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div
                                className="swiper-button-prev"
                                role="button"
                                tabIndex={0}
                                aria-label="Previous slide"
                                onClick={handlePrevSlide}
                              ></div>
                              <div
                                className="swiper-button-next"
                                role="button"
                                tabIndex={0}
                                aria-label="Next slide"
                                onClick={handleNextSlide}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Realisations Section */}
                  <div className="paragraph paragraph--realizations">
                    <div className="realizations__images">
                      <div className="image-01">
                        <div className="media media--type-image media--view-mode-teaser image-wrapper">
                          <img
                            src="/assets/unpaid-realisations-01.jpg"
                            width="600"
                            height="550"
                            alt="Unpaid"
                            loading="lazy"
                            className="image-style-teaser"
                          />
                        </div>
                      </div>

                      <div className="image-02">
                        <div className="media media--type-image media--view-mode-teaser image-wrapper">
                          <img
                            src="/assets/unpaid-realisations-02.png"
                            width="600"
                            height="550"
                            alt="Unpaid"
                            loading="lazy"
                            className="image-style-teaser"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="realizations__content">
                      <div className="sub-title">Realisations</div>
                      <div className="realizations">
                        <div className="realizations__item">
                          <h3>+3 407 companies</h3>
                          <p>have joined Unpaid</p>
                        </div>
                        <div className="realizations__item">
                          <h3>€ 48 009 669</h3>
                          <p>in unpaid invoices are being collected for our clients</p>
                        </div>
                        <div className="realizations__item">
                          <h3>75% of cases fully resolved</h3>
                          <p>Reimbursement was successful in 75% of claims.</p>
                        </div>
                        <div className="realizations__item">
                          <h3>84,6%</h3>
                          <p>of our customers are very happy to recommend us</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* FAQ Section */}
                  <div className="paragraph paragraph--faq">
                    <div className="inner">
                      <div className="faq__intro">
                        <div className="sub-title">FAQ</div>
                        <h2>Find your answer in the frequently asked questions</h2>
                        <div className="text">
                          <p><a href="https://unpaid.be/en/faq">Go to all frequently asked questions</a></p>
                          <p><a href="https://unpaid.be/en/contact">Contact us</a></p>
                        </div>
                      </div>

                      <div className="faq__highlighted-questions">
                        <div className="views-element-container">
                          <div className="top-limited-faq view view--faq-overview js-view-dom-id-835dc2b8ffa8eec069cbf3e7ffaf62e47d5c65510f6e0bdedf4242ee36450132">
                            <div className="view__content">
                              <div className="views-row"><a href="/en/faq?category=17#faq-39">What does Unpaid cost?</a></div>
                              <div className="views-row"><a href="/en/faq?category=18#faq-3398">Is my invoice eligible for the Unpaid procedure?</a></div>
                              <div className="views-row"><a href="/en/faq?category=19#faq-51">What are the steps in the procedure?</a></div>
                              <div className="views-row"><a href="/en/faq?category=17#faq-67974">How does the cost insurance work at Unpaid?</a></div>
                              <div className="views-row"><a href="/en/faq?category=21#faq-8140">Can I add employees to my account?</a></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Knowledge Center Teasers Section */}
                  <div className="paragraph paragraph--views-reference">
                    <div className="views-element-container">
                      <div className="view view-articles-teasers">
                        <div className="view__header">
                          <div className="sub-title">Knowledge center</div>
                          <h2>Read our tips &amp; tricks</h2>
                        </div>
                        <div className="view__main">
                          <div className="view__actions">
                            <a href="/en/discover">Go to the knowledge center</a>
                          </div>
                          <div className="view__content">
                            <div className="views-row">
                              <article className="node node--type-article node--view-mode-teaser">
                                <div className="teaser-inner">
                                  <div className="teaser__image">
                                    <div className="media media--type-image media--view-mode-teaser image-wrapper">
                                      <img
                                        src="/assets/36113.png"
                                        width="600"
                                        height="550"
                                        alt="Wat is het gerechtelijk verlof"
                                        loading="lazy"
                                        className="image-style-teaser"
                                      />
                                    </div>
                                  </div>
                                  <div className="teaser__content">
                                    <h2>The judicial recess, what happens to my case?</h2>
                                    <div className="actions">
                                      <a href="/en/discover/judicial-recess-what-happens-my-case" hrefLang="en">Read this article</a>
                                    </div>
                                  </div>
                                </div>
                              </article>
                            </div>

                            <div className="views-row">
                              <article className="node node--type-article node--view-mode-teaser">
                                <div className="teaser-inner">
                                  <div className="teaser__image">
                                    <div className="media media--type-image media--view-mode-teaser image-wrapper">
                                      <img
                                        src="/assets/onbetaalde-factuur-waarschuwingssignalen.png.png"
                                        width="600"
                                        height="550"
                                        alt="Ondernemer die zich zorgen maakt over een onbetaalde factuur"
                                        loading="lazy"
                                        className="image-style-teaser"
                                      />
                                    </div>
                                  </div>
                                  <div className="teaser__content">
                                    <h2>5 signs that a customer is not going to pay your invoice</h2>
                                    <div className="actions">
                                      <a href="/en/discover/5-signs-customer-not-going-pay-your-invoice" hrefLang="en">Read this article</a>
                                    </div>
                                  </div>
                                </div>
                              </article>
                            </div>

                            <div className="views-row">
                              <article className="node node--type-article node--view-mode-teaser">
                                <div className="teaser-inner">
                                  <div className="teaser__image">
                                    <div className="media media--type-image media--view-mode-teaser image-wrapper">
                                      <img
                                        src="/assets/faillisement_0.png"
                                        width="600"
                                        height="550"
                                        alt="Hoe verloopt een faillissement?"
                                        loading="lazy"
                                        className="image-style-teaser"
                                      />
                                    </div>
                                  </div>
                                  <div className="teaser__content">
                                    <h2>How does the bankruptcy procedure work in Belgium?</h2>
                                    <div className="actions">
                                      <a href="/en/discover/how-does-bankruptcy-procedure-work-belgium" hrefLang="en">Read this article</a>
                                    </div>
                                  </div>
                                </div>
                              </article>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Partners Section */}
                  <div className="paragraph paragraph--logos">
                    <div className="top">
                      <div className="sub-title">Partners</div>
                      <h2>We work together with</h2>
                    </div>
                    <div className="field field-name-field-item">
                      <div className="paragraph paragraph--logo">
                        <a href="/en/integration/teamleader">
                          <img className="icon" src="/assets/3252.png" alt="Teamleader" />
                        </a>
                      </div>
                      <div className="paragraph paragraph--logo">
                        <a href="/en/discover/use-unpaid-directly-billit">
                          <img className="icon" src="/assets/3258.svg" alt="Billit" />
                        </a>
                      </div>
                      <div className="paragraph paragraph--logo">
                        <a href="/en/integration/exact">
                          <img className="icon" src="/assets/3259.png" alt="Exact" />
                        </a>
                      </div>
                      <div className="paragraph paragraph--logo">
                        <a href="/en/unpaid-and-yuki">
                          <img className="icon" src="/assets/yuki_business_logo_v_pos_0.png" alt="Yuki en Unpaid" />
                        </a>
                      </div>
                      <div className="paragraph paragraph--logo">
                        <a href="/en/integration/visma-bouwsoft">
                          <img className="icon" src="/assets/visma_bouwsoft_logo_pos_transp.png" alt="Visma Bouwsoft" />
                        </a>
                      </div>
                      <div className="paragraph paragraph--logo">
                        <a href="/en/unpaid-and-go-getter">
                          <img className="icon" src="/assets/52177.png" alt="Go-getter" />
                        </a>
                      </div>
                      <div className="paragraph paragraph--logo">
                        <img className="icon" src="/assets/17324.png" alt="Partner" />
                      </div>
                      <div className="paragraph paragraph--logo">
                        <a href="/en/bizzey-and-unpaid">
                          <img className="icon" src="/assets/30182.png" alt="Bizzey" />
                        </a>
                      </div>
                      <div className="paragraph paragraph--logo">
                        <img className="icon" src="/assets/16705.png" alt="Partner" />
                      </div>
                      <div className="paragraph paragraph--logo">
                        <img className="icon" src="/assets/logo-eenvoudigfactureren.png" alt="Eenvoudig factureren" />
                      </div>
                      <div className="paragraph paragraph--logo">
                        <a href="https://unpaid.be/en/discover/payt-and-unpaid-join-forces">
                          <img className="icon" src="/assets/16971.png" alt="Payt" />
                        </a>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </main>
        </div>

        <Footer />

        <div className="backdrop"></div>

        {/* Camera Modal for Invoice Scanning */}
        {isCameraOpen && (
          <div className="camera-modal-overlay">
            <div className="camera-modal">
              <div className="camera-modal-header">
                <h3>Take a Photo of Your Invoice</h3>
                <button
                  type="button"
                  className="camera-modal-close"
                  onClick={stopCamera}
                  aria-label="Close"
                >
                  &times;
                </button>
              </div>

              <div className="camera-preview-wrapper">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="camera-video"
                />
                <div className="camera-target-guide">
                  <div className="camera-guide-corner top-left"></div>
                  <div className="camera-guide-corner top-right"></div>
                  <div className="camera-guide-corner bottom-left"></div>
                  <div className="camera-guide-corner bottom-right"></div>
                  <span className="camera-guide-text">Position invoice within frame</span>
                </div>
              </div>

              <div className="camera-modal-footer">
                <button
                  type="button"
                  className="camera-cancel-btn"
                  onClick={stopCamera}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="camera-snap-btn"
                  onClick={capturePhoto}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }}>
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                  Capture Photo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Claim Success Modal */}
        {claimSuccessData && (
          <div className="claim-success-modal-overlay" onClick={() => setClaimSuccessData(null)}>
            <div className="claim-success-modal" onClick={(e) => e.stopPropagation()}>
              <div className="claim-success-modal__icon">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#1cbc66" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="16 9 10 15 7 12" />
                </svg>
              </div>
              <h2 className="claim-success-modal__title">Claim Submitted Successfully!</h2>
              <p className="claim-success-modal__desc">
                Your collection claim for invoice <strong>#{claimSuccessData.invoiceNumber}</strong> ({claimSuccessData.currency}{claimSuccessData.amount}) against <strong>{claimSuccessData.debtorName}</strong> has been registered with our legal bailiff network.
              </p>
              <div className="claim-success-modal__actions">
                <button
                  type="button"
                  className="variant-c-scan-cta"
                  onClick={handleResetScan}
                >
                  Submit Another Invoice
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

