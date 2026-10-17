# Somewhere — Travel to the Unknown

A responsive travel and tourism landing page for people looking for nature-led
escapes, thoughtful itineraries, and inspiration for their next trip. The
experience combines destination discovery with a travel-request demo and an
editorial travel journal.

> **Website name suggestion:** **Somewhere**. It echoes the site's “find your
> somewhere” language and gives the current “To The Unknown” theme a more
> distinctive brand. The interface still uses **Travel** as its displayed
> brand; changing the live branding is a separate update. Check domain and
> trademark availability before adopting the name commercially.

## What’s included

- A full-width travel hero with a destination, date, and traveler search form.
- Eight curated destination cards across mountain, coast, city, and jungle
  categories, with trip lengths and starting prices.
- Destination filtering and date-range validation. Search results are based on
  the destinations included in the page; dates do not check live availability.
- A booking-request dialog with traveler details, date validation, a guest
  selector, and an estimated total.
- A confirmation dialog with a request reference and trip summary.
- About, experiences, travel quote, journal, newsletter, and footer sections.
- Responsive navigation, reveal animations, and reduced-motion support.

## Built with

- [Next.js](https://nextjs.org/) 15 and the App Router
- React 19
- CSS
- Unsplash-hosted images

## Run locally

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Create and run an optimized production build:

```bash
npm run build
npm start
```

## Demo behavior and limitations

Booking requests are saved in the current browser's `localStorage` under
`travel-booking-requests`. The displayed total is the trip's listed per-person
price multiplied by the number of travelers. This is a front-end demonstration:
it does not charge a payment method, reserve a trip, or verify availability,
and requests are not sent to a server.

The newsletter form displays a local confirmation message but does not submit
or store an email subscription. To use this site for real bookings or
subscriptions, connect a backend/API and the appropriate booking, payment, and
email services.
