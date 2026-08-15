import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div>
      <section style={heroStyle}>
        <h1 style={{ fontSize: '2.5rem', margin: '0 0 1rem' }}>About ShopHub</h1>
        <p style={{ fontSize: '1.15rem', maxWidth: 700, margin: '0 auto', opacity: 0.95 }}>
          We exist to make quality products affordable and accessible — delivered to your
          doorstep, anywhere in Nigeria, for free.
        </p>
      </section>

      <section style={sectionStyle}>
        <div style={twoColStyle}>
          <div>
            <h2 style={h2Style}>Our Story</h2>
            <p style={pStyle}>
              ShopHub started with a simple frustration: buying things online shouldn't mean
              waiting weeks, paying sky-high delivery fees, or trusting stores you've never heard of.
              We set out to build an online marketplace that puts the customer first — honest prices,
              real products, and delivery you can actually count on.
            </p>
            <p style={pStyle}>
              Today, thousands of customers across the country shop with us for everything from
              fashion and electronics to home essentials. Every order is handled with care, every
              payment is protected, and every product can be reviewed by the people who bought it.
            </p>
          </div>
          <div style={cardStyle}>
            <h3 style={h3Style}>Why Customers Choose Us</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Feature icon="🚚" text="Free delivery on orders above ₦50,000" />
              <Feature icon="🔒" text="Secure payments with Paystack" />
              <Feature icon="⭐" text="Real reviews from verified buyers" />
              <Feature icon="↩️" text="Hassle-free order tracking" />
              <Feature icon="🎧" text="Friendly support, 7 days a week" />
            </ul>
          </div>
        </div>
      </section>

      <section style={{ ...sectionStyle, background: '#fff' }}>
        <h2 style={{ ...h2Style, textAlign: 'center' }}>Our Mission &amp; Values</h2>
        <div style={gridStyle}>
          <ValueCard
            icon="🎯"
            title="Customer First"
            text="Every decision we make starts with one question: does it make shopping easier for our customers?"
          />
          <ValueCard
            icon="🤝"
            title="Trust & Honesty"
            text="Verified payments, transparent pricing, and real reviews from real buyers — no tricks, no hidden fees."
          />
          <ValueCard
            icon="💡"
            title="Innovation"
            text="From instant order tracking to secure checkout, we keep improving the way Nigeria shops online."
          />
          <ValueCard
            icon="🌍"
            title="Accessibility"
            text="We're committed to making quality products available to everyone, no matter where they live."
          />
        </div>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ ...h2Style, textAlign: 'center' }}>How It Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          <Step number="1" title="Create your account" text="Sign up in seconds. It's free and keeps your orders and delivery details safe." />
          <Step number="2" title="Shop your favourites" text="Browse products, read verified reviews, and add what you love to your cart." />
          <Step number="3" title="Pay securely & relax" text="Check out safely with Paystack, then track your order until it reaches your door." />
        </div>
      </section>

      <section style={{ ...sectionStyle, textAlign: 'center', background: '#eef2ff' }}>
        <h2 style={h2Style}>What Our Customers Say</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          <Testimonial quote="Fast delivery and the product was exactly as described. Shopping here feels safe." name="Amaka O." />
          <Testimonial quote="The reviews helped me pick the right size the first time. Brilliant feature!" name="Tunde B." />
          <Testimonial quote="Free delivery made all the difference. I order from ShopHub every month now." name="Chidinma E." />
        </div>
      </section>

      <section style={{ ...sectionStyle, textAlign: 'center' }}>
        <h2 style={h2Style}>Ready to shop with us now?</h2>
        <p style={{ color: '#4b5563', marginBottom: '1.5rem' }}>
          Join thousands of happy customers and get your favourite products delivered free to your door.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/products" className="btn btn-primary">Start Shopping from here</Link>
          <Link to="/register" className="btn btn-outline">Create an Account now</Link>
        </div>
      </section>

      <section style={{ ...sectionStyle, paddingBottom: '4rem' }}>
        <h2 style={{ ...h2Style, textAlign: 'center' }}>Get in Touch</h2>
        <div style={{ ...cardStyle, maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <p style={pStyle}><strong>Email:</strong> support@shophub.com</p>
          <p style={pStyle}><strong>Phone:</strong> (+234) 916-4794-335</p>
          <p style={pStyle}><strong>Address: </strong>1 Commerce St, Lagos, Nigeria.</p>
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, text }) {
  return (
    <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#374151' }}>
      <span style={{ fontSize: '1.2rem' }}>{icon}</span>
      <span>{text}</span>
    </li>
  );
}

function ValueCard({ icon, title, text }) {
  return (
    <div style={cardStyle}>
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
      <h3 style={h3Style}>{title}</h3>
      <p style={{ color: '#4b5563', margin: 0 }}>{text}</p>
    </div>
  );
}

function Step({ number, title, text }) {
  return (
    <div style={cardStyle}>
      <div style={stepBadgeStyle}>{number}</div>
      <h3 style={h3Style}>{title}</h3>
      <p style={{ color: '#4b5563', margin: 0 }}>{text}</p>
    </div>
  );
}

function Testimonial({ quote, name }) {
  return (
    <div style={{ ...cardStyle, background: '#fff' }}>
      <p style={{ fontStyle: 'italic', color: '#374151', margin: '0 0 0.75rem' }}>&ldquo;{quote}&rdquo;</p>
      <strong style={{ color: '#2563eb' }}>— {name}</strong>
    </div>
  );
}

const heroStyle = {
  textAlign: 'center',
  padding: '4.5rem 1rem',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#fff',
};
const sectionStyle = { padding: '3rem 1rem', maxWidth: 1200, margin: '0 auto' };
const twoColStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '2rem',
  alignItems: 'start',
};
const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: '1.5rem',
  marginTop: '1.5rem',
};
const cardStyle = {
  padding: '1.5rem',
  background: '#f8f9fa',
  borderRadius: '12px',
  border: '1px solid #e5e7eb',
};
const h2Style = { fontSize: '1.75rem', color: '#1f2937', marginBottom: '1rem' };
const h3Style = { fontSize: '1.1rem', color: '#1f2937', marginBottom: '0.5rem' };
const pStyle = { color: '#4b5563', marginBottom: '0.75rem' };
const stepBadgeStyle = {
  width: 36,
  height: 36,
  borderRadius: '50%',
  background: '#2563eb',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  marginBottom: '0.75rem',
};
