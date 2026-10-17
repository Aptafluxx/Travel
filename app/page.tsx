"use client";

import { useEffect, useRef, useState } from "react";

type Trip = {
  id: string;
  category: string;
  kicker: string;
  title: string;
  description: string;
  days: number;
  price: number;
  image: string;
  alt: string;
};

type Booking = {
  reference: string;
  tripId: string;
  tripName: string;
  startDate: string;
  endDate: string;
  guests: number;
  estimatedTotal: number;
  name: string;
  email: string;
  createdAt: string;
};

type SearchState = {
  category?: string;
  startDate: string;
  endDate: string;
  guests: string;
};

const destinations: Trip[] = [
  {
    id: "wild",
    category: "mountain",
    kicker: "01 / Wild places",
    title: "Find Your Wild",
    description: "Mountain air, open trails, and room to roam.",
    days: 7,
    price: 840,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=85",
    alt: "Golden sunrise over a mountain valley",
  },
  {
    id: "blue",
    category: "coast",
    kicker: "02 / Coastal days",
    title: "Chasing Blue",
    description: "Saltwater afternoons and slow island days.",
    days: 5,
    price: 690,
    image:
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=700&q=85",
    alt: "Waves rolling onto a quiet tropical beach",
  },
  {
    id: "clouds",
    category: "mountain",
    kicker: "03 / High country",
    title: "Above The Clouds",
    description: "Take the long way up. The view is worth it.",
    days: 8,
    price: 1120,
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=700&q=85",
    alt: "Snow-covered mountain beneath a starry night sky",
  },
  {
    id: "forest",
    category: "jungle",
    kicker: "04 / Into the green",
    title: "Forest & Found",
    description: "Follow the trees to somewhere unexpected.",
    days: 6,
    price: 760,
    image:
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=700&q=85",
    alt: "Wild deer in a sunlit forest",
  },
  {
    id: "greek",
    category: "coast city",
    kicker: "05 / Faraway shores",
    title: "Somewhere Greek",
    description: "Blue horizons, little harbors, and no rush.",
    days: 6,
    price: 980,
    image:
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=700&q=85",
    alt: "Whitewashed homes overlooking the Mediterranean sea",
  },
  {
    id: "untamed",
    category: "jungle",
    kicker: "06 / Untamed lands",
    title: "Into The Wild",
    description: "Meet the wilderness on its own terms.",
    days: 9,
    price: 1480,
    image:
      "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=700&q=85",
    alt: "Elephant walking through a golden African landscape",
  },
  {
    id: "scenic",
    category: "mountain",
    kicker: "07 / Open roads",
    title: "Take The Scenic",
    description: "Small roads, big skies, and nowhere to be.",
    days: 4,
    price: 540,
    image:
      "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=700&q=85",
    alt: "A quiet road winding through a lush green valley",
  },
  {
    id: "golden",
    category: "mountain",
    kicker: "08 / Slow mornings",
    title: "Golden Hour",
    description: "Catch the light in a place made for pausing.",
    days: 5,
    price: 720,
    image:
      "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=700&q=85",
    alt: "Sunrise glowing over misty rolling hills",
  },
];

const experiences: Array<[string, string, string]> = [
  ["◎", "Worldwide", "Thoughtful journeys to places worth the trip."],
  ["↟", "Adventures", "Get out there, go a little further, feel a little more."],
  ["♨", "Foods & Drinks", "Local flavors and the stories that come with them."],
  ["⌂", "Affordable Hotels", "Lovely places to land, whatever your kind of trip."],
  ["▤", "Affordable Price", "Clear prices, no surprises, more travel for your money."],
  ["♡", "Great Support", "Real people, here whenever you need a hand."],
];

const journal: Array<{
  image: string;
  alt: string;
  kicker: string;
  title: string;
}> = [
  {
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85",
    alt: "Layered mountain peaks in morning light",
    kicker: "The long way around · 6 min read",
    title: "What the mountains teach you about slowing down",
  },
  {
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=85",
    alt: "Sunlight shimmering across turquoise ocean water",
    kicker: "A little further · 4 min read",
    title: "Find your own quiet corner of the coast",
  },
  {
    image:
      "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=900&q=85",
    alt: "Sunlight falling through a forest trail",
    kicker: "Notes from nature · 5 min read",
    title: "Take the trail with no name on the map",
  },
];

const today = () => {
  const date = new Date();
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
};

function BookingDialog({
  trip,
  initialSearch,
  onClose,
  onBooked,
}: {
  trip: Trip;
  initialSearch: SearchState;
  onClose: () => void;
  onBooked: (booking: Booking) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [todayValue, setTodayValue] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    startDate: initialSearch.startDate,
    endDate: initialSearch.endDate,
    guests: initialSearch.guests,
  });
  useEffect(() => {
    setTodayValue(today());
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const guestCount = Number(form.guests);
    if (!form.startDate || new Date(`${form.startDate}T00:00:00`) < new Date(`${today()}T00:00:00`)) {
      setError("Choose a departure date today or later.");
      return;
    }
    if (!form.endDate || form.endDate <= form.startDate) {
      setError("Choose a return date after your departure date.");
      return;
    }
    if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 12) {
      setError("Choose between 1 and 12 travelers.");
      return;
    }

    setSaving(true);
    const booking = {
      reference: `TR-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      tripId: trip.id,
      tripName: trip.title,
      startDate: form.startDate,
      endDate: form.endDate,
      guests: guestCount,
      estimatedTotal: trip.price * guestCount,
      name: form.name.trim(),
      email: form.email.trim(),
      createdAt: new Date().toISOString(),
    };
    try {
      const savedBookings = JSON.parse(localStorage.getItem("travel-booking-requests") || "[]");
      if (!Array.isArray(savedBookings)) throw new Error("Saved requests could not be read.");
      localStorage.setItem(
        "travel-booking-requests",
        JSON.stringify([...savedBookings, booking]),
      );
      onBooked(booking);
    } catch {
      setSaving(false);
      setError("We couldn’t save your request in this browser. Please try again.");
    }
  }

  return (
    <dialog
      className="booking-dialog"
      ref={dialogRef}
      aria-labelledby="booking-dialog-title"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <button className="dialog-close" type="button" onClick={onClose} aria-label="Close booking form">
        ×
      </button>
      <p className="eyebrow">Your next story</p>
      <h2 id="booking-dialog-title">Request a trip</h2>
      <p className="dialog-trip">{trip.title} · {trip.days} days · from ${trip.price.toLocaleString()} per person</p>
      <form className="booking-form" onSubmit={handleSubmit}>
        <label>
          <span>Your name</span>
          <input
            autoComplete="name"
            name="name"
            required
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
          />
        </label>
        <label>
          <span>Email address</span>
          <input
            autoComplete="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </label>
        <label>
          <span>Departure date</span>
          <input
            name="startDate"
            type="date"
            min={todayValue || undefined}
            required
            value={form.startDate}
            onChange={(event) => setForm({ ...form, startDate: event.target.value })}
          />
        </label>
        <label>
          <span>Return date</span>
          <input
            name="endDate"
            type="date"
            min={form.startDate || todayValue || undefined}
            required
            value={form.endDate}
            onChange={(event) => setForm({ ...form, endDate: event.target.value })}
          />
        </label>
        <label>
          <span>Travelers</span>
          <select
            name="guests"
            value={form.guests}
            onChange={(event) => setForm({ ...form, guests: event.target.value })}
          >
            {Array.from({ length: 12 }, (_, index) => index + 1).map((count) => (
              <option value={count} key={count}>{count} {count === 1 ? "traveler" : "travelers"}</option>
            ))}
          </select>
        </label>
        <p className="booking-estimate">
          Estimated trip total <strong>${(trip.price * Number(form.guests)).toLocaleString()}</strong>
        </p>
        {error && <p className="form-error" role="alert">{error}</p>}
        <p className="booking-disclaimer">
          This saves a request in this browser; it does not charge you or reserve availability.
        </p>
        <button className="button search-button dialog-submit" type="submit" disabled={saving}>
          {saving ? "Saving request…" : "Request this trip"} <span aria-hidden="true">↗</span>
        </button>
      </form>
    </dialog>
  );
}

function BookingConfirmation({
  booking,
  onClose,
}: {
  booking: Booking;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  return (
    <dialog className="booking-dialog confirmation-dialog" ref={dialogRef} aria-labelledby="confirmation-title" onCancel={onClose}>
      <button className="dialog-close" type="button" onClick={onClose} aria-label="Close confirmation">×</button>
      <span className="confirmation-check" aria-hidden="true">✓</span>
      <p className="eyebrow">Request saved</p>
      <h2 id="confirmation-title">A little closer to somewhere.</h2>
      <p>Your trip request for <strong>{booking.tripName}</strong> has been saved in this browser.</p>
      <div className="confirmation-details">
        <span>Reference <b>{booking.reference}</b></span>
        <span>Departure <b>{new Date(`${booking.startDate}T00:00:00`).toLocaleDateString()}</b></span>
        <span>Return <b>{new Date(`${booking.endDate}T00:00:00`).toLocaleDateString()}</b></span>
        <span>Travelers <b>{booking.guests}</b></span>
        <span>Estimated total <b>${booking.estimatedTotal.toLocaleString()}</b></span>
      </div>
      <button className="button search-button dialog-submit" type="button" onClick={onClose}>Back to exploring</button>
    </dialog>
  );
}

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [searchMessage, setSearchMessage] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState<SearchState | null>(null);
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [bookingTrip, setBookingTrip] = useState<Trip | null>(null);
  const [confirmation, setConfirmation] = useState<Booking | null>(null);
  const [todayValue, setTodayValue] = useState("");
  const [currentYear, setCurrentYear] = useState("2025");
  const [search, setSearch] = useState<SearchState>({ startDate: "", endDate: "", guests: "2" });

  useEffect(() => {
    setTodayValue(today());
    setCurrentYear(String(new Date().getFullYear()));
    const elements = document.querySelectorAll(".reveal");
    document.documentElement.classList.add("motion-ready");
    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return () => document.documentElement.classList.remove("motion-ready");
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 },
    );
    elements.forEach((element) => observer.observe(element));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("motion-ready");
    };
  }, []);

  const filteredDestinations = submittedSearch?.category
    ? destinations.filter((trip) => trip.category.split(" ").includes(submittedSearch.category ?? ""))
    : destinations;

  function searchTrips(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!search.startDate || !search.endDate) {
      setSearchMessage("Choose both a check-in and check-out date to search.");
      return;
    }
    if (search.startDate < today()) {
      setSearchMessage("Check-in must be today or later.");
      return;
    }
    if (search.endDate <= search.startDate) {
      setSearchMessage("Your return date must be after your departure date.");
      return;
    }
    const nextSearch = { ...search, category };
    setSubmittedSearch(nextSearch);
    const matchingTrips = nextSearch.category
      ? destinations.filter((trip) => trip.category.split(" ").includes(nextSearch.category))
      : destinations;
    const dateRange = `${new Date(`${search.startDate}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" })}–${new Date(`${search.endDate}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
    const travelerLabel = Number(search.guests) === 1 ? "traveler" : "travelers";
    setSearchMessage(
      `${matchingTrips.length} ${matchingTrips.length === 1 ? "trip" : "trips"} found for ${dateRange} · ${search.guests} ${travelerLabel}. Choose a trip to request your booking.`,
    );
    document.querySelector("#destinations")?.scrollIntoView({ behavior: "smooth" });
  }

  function handleNewsletter(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const emailField = new FormData(event.currentTarget).get("email");
    const email = typeof emailField === "string" ? emailField : "";
    setNewsletterMessage(`Thanks for joining us, ${email}.`);
    event.currentTarget.reset();
  }

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Travel home">Travel<span>.</span></a>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="site-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span /><span /><span className="sr-only">Toggle navigation</span>
        </button>
        <nav className={`site-nav${menuOpen ? " is-open" : ""}`} id="site-nav" aria-label="Main navigation">
          <a className="active" href="#home" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#destinations" onClick={() => setMenuOpen(false)}>Destination</a>
          <a href="#experiences" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="#guides" onClick={() => setMenuOpen(false)}>Guide</a>
          <a href="#journal" onClick={() => setMenuOpen(false)}>Blog</a>
          <a className="nav-cta" href="#booking" onClick={() => setMenuOpen(false)}>Book Now <span aria-hidden="true">↗</span></a>
        </nav>
      </header>

      <main>
        <section className="hero" id="home" aria-labelledby="hero-title">
          <div className="hero-image" />
          <div className="hero-content">
            <p className="eyebrow">Follow your curiosity</p>
            <h1 id="hero-title">To The Unknown</h1>
            <p className="hero-copy">
              The best journeys take you somewhere new — and bring you closer to yourself.
              Find a place that stays with you.
            </p>
            <a className="button button-outline" href="#destinations">Explore now <span aria-hidden="true">↗</span></a>
          </div>
          <div className="hero-bottom">
            <p className="hero-note"><span className="status-dot" /> Your next story starts here</p>
            <div className="hero-count"><span>01</span> <i /> 04</div>
          </div>
          <form className="booking-bar" id="booking" onSubmit={searchTrips}>
            <label>
              <span>Where to?</span>
              <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Choose a destination">
                <option value="">Choose destination</option>
                <option value="mountain">Mountain escapes</option>
                <option value="coast">Coastal retreats</option>
                <option value="city">City discoveries</option>
                <option value="jungle">Jungle adventures</option>
              </select>
            </label>
            <label>
              <span>Check in</span>
              <input
                type="date"
                min={todayValue || undefined}
                required
                value={search.startDate}
                onChange={(event) => setSearch({ ...search, startDate: event.target.value })}
                aria-label="Check-in date"
              />
            </label>
            <label>
              <span>Check out</span>
              <input
                type="date"
                min={search.startDate || todayValue || undefined}
                required
                value={search.endDate}
                onChange={(event) => setSearch({ ...search, endDate: event.target.value })}
                aria-label="Check-out date"
              />
            </label>
            <label>
              <span>Travelers</span>
              <select
                value={search.guests}
                onChange={(event) => setSearch({ ...search, guests: event.target.value })}
                aria-label="Number of travelers"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((count) => (
                  <option value={count} key={count}>{count} {count === 1 ? "traveler" : "travelers"}</option>
                ))}
              </select>
            </label>
            <button className="button search-button" type="submit"><span aria-hidden="true">⌕</span> Find a trip</button>
          </form>
        </section>

        <section className="intro section-wrap reveal" id="about">
          <div className="intro-media">
            <img
              src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1000&q=85"
              alt="A peaceful alpine lake surrounded by mountains"
              loading="lazy"
            />
            <span className="play-button" aria-hidden="true">▶</span>
            <div className="media-caption"><span>Our story</span><span>01:24</span></div>
            <div className="media-dots" aria-hidden="true"><i /><i /><i /></div>
          </div>
          <div className="intro-copy">
            <p className="eyebrow">Go beyond the ordinary</p>
            <h2>Nature&apos;s Majesty<br />Awaits You</h2>
            <p>
              Slow down, take the scenic route, and let the world surprise you. From
              quiet mountain mornings to coastlines that stretch forever, we make
              getting away feel effortless.
            </p>
            <p className="muted-copy">Thoughtfully planned trips. Local perspectives. More room to wander.</p>
            <a className="text-link" href="#experiences">Discover our story <span aria-hidden="true">↗</span></a>
          </div>
        </section>

        <section className="destinations section-wrap reveal" id="destinations">
          <div className="section-heading">
            <div><p className="eyebrow">Find your somewhere</p><h2>Make Yours Destination</h2></div>
            <button
              className="text-link desktop-link reset-search"
              type="button"
              onClick={() => {
                setCategory("");
                setSubmittedSearch(null);
                setSearchMessage("");
                setSearch({ startDate: "", endDate: "", guests: "2" });
              }}
            >
              View all destinations <span aria-hidden="true">↗</span>
            </button>
          </div>
          {searchMessage && <p className="results-message" role="status">{searchMessage}</p>}
          <div className="destination-grid">
            {filteredDestinations.map((trip) => (
              <article className="destination-card" key={trip.id}>
                <img src={trip.image} alt={trip.alt} loading="lazy" />
                <div className="card-content">
                  <span className="card-kicker">{trip.kicker}</span>
                  <h3>{trip.title}</h3>
                  <p>{trip.description}</p>
                  <div className="card-meta"><span>{trip.days} days</span><span>From <b>${trip.price.toLocaleString()}</b></span></div>
                  <button className="trip-book-link" type="button" onClick={() => setBookingTrip(trip)}>
                    Request trip <span aria-hidden="true">↗</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
          <button
            className="text-link mobile-link reset-search"
            type="button"
            onClick={() => {
              setCategory("");
              setSubmittedSearch(null);
              setSearchMessage("");
              setSearch({ startDate: "", endDate: "", guests: "2" });
            }}
          >
            Clear search <span aria-hidden="true">↗</span>
          </button>
        </section>

        <section className="experiences section-wrap reveal" id="experiences">
          <div className="section-heading">
            <div><p className="eyebrow">Little things, big memories</p><h2>Countless Experience</h2></div>
            <p className="heading-note">Every trip is different. The feeling of being somewhere new never gets old.</p>
          </div>
          <div className="experience-grid">
            {experiences.map(([icon, title, description]) => (
              <article className="experience-card" key={title}>
                <span className="experience-icon" aria-hidden="true">{icon}</span>
                <h3>{title}</h3><p>{description}</p>
                <a href="#destinations" aria-label={`Explore ${title.toLowerCase()}`}>↗</a>
              </article>
            ))}
          </div>
        </section>

        <section className="quote-band reveal" id="guides">
          <div className="quote-image" />
          <div className="quote-content">
            <p className="eyebrow">A note from the road</p>
            <blockquote>“We travel not to escape life, but for life not to escape us.”</blockquote>
            <p className="quote-author">— Robyn Yong <span>Traveler &amp; storyteller</span></p>
          </div>
        </section>

        <section className="journal section-wrap reveal" id="journal">
          <div className="section-heading">
            <div><p className="eyebrow">Field notes</p><h2>Stories From Somewhere</h2></div>
            <a className="text-link desktop-link" href="#journal">Read the journal <span aria-hidden="true">↗</span></a>
          </div>
          <div className="journal-grid">
            {journal.map((story) => (
              <article className="journal-card" key={story.title}>
                <img src={story.image} alt={story.alt} loading="lazy" />
                <p className="eyebrow">{story.kicker}</p>
                <h3>{story.title}</h3>
                <a className="text-link" href="#journal">Read story <span aria-hidden="true">↗</span></a>
              </article>
            ))}
          </div>
        </section>

        <section className="newsletter reveal">
          <div><p className="eyebrow">A little wanderlust in your inbox</p><h2>Good journeys start with a hello.</h2></div>
          <form className="newsletter-form" onSubmit={handleNewsletter}>
            <label className="sr-only" htmlFor="email">Your email address</label>
            <input id="email" name="email" type="email" placeholder="Your email address" required />
            <button type="submit">Join us <span aria-hidden="true">↗</span></button>
          </form>
          <p className="newsletter-message" role="status" aria-live="polite">{newsletterMessage}</p>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand"><a className="brand" href="#home">Travel<span>.</span></a><p>Go somewhere that changes you.<br />We&apos;ll help you find it.</p></div>
          <div className="footer-column"><h2>Explore</h2><a href="#destinations">Destinations</a><a href="#experiences">Experiences</a><a href="#guides">Travel guides</a></div>
          <div className="footer-column"><h2>About</h2><a href="#about">Our story</a><a href="#journal">Journal</a><a href="#booking">Get in touch</a></div>
          <div className="footer-column"><h2>Say hello</h2><a href="mailto:hello@travel.example">hello@travel.example</a><p>Follow the feeling <span className="social-links"><a href="#home" aria-label="Instagram">ig</a><a href="#home" aria-label="Pinterest">p</a><a href="#home" aria-label="Facebook">f</a></span></p></div>
        </div>
        <div className="footer-bottom"><span>© {currentYear} Travel. Made for the curious.</span><div><a href="#home">Privacy</a><a href="#home">Terms</a></div><a href="#home">Back to top ↑</a></div>
      </footer>

      {bookingTrip && (
        <BookingDialog
          trip={bookingTrip}
          initialSearch={search}
          onClose={() => setBookingTrip(null)}
          onBooked={(booking) => {
            setBookingTrip(null);
            setConfirmation(booking);
          }}
        />
      )}
      {confirmation && (
        <BookingConfirmation booking={confirmation} onClose={() => setConfirmation(null)} />
      )}
    </>
  );
}
