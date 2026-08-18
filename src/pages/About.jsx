import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen">
      <section className="bg-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">About ShopHub</h1>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We exist to make quality products affordable and accessible — delivered to your
            doorstep, anywhere in Nigeria, for free.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              ShopHub started with a simple frustration: buying things online shouldn't mean
              waiting weeks, paying sky-high delivery fees, or trusting stores you've never heard of.
              We set out to build an online marketplace that puts the customer first — honest prices,
              real products, and delivery you can actually count on.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Today, thousands of customers across the country shop with us for everything from
              fashion and electronics to home essentials. Every order is handled with care, every
              payment is protected, and every product can be reviewed by the people who bought it.
            </p>
          </div>
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-5">Why Customers Choose Us</h3>
            <ul className="space-y-4">
              <Feature icon="🚚" text="Free delivery on orders above ₦50,000" />
              <Feature icon="🔒" text="Secure payments with Paystack" />
              <Feature icon="⭐" text="Real reviews from verified buyers" />
              <Feature icon="↩️" text="Hassle-free order tracking" />
              <Feature icon="🎧" text="Friendly support, 7 days a week" />
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Our Mission &amp; Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ValueCard icon="🎯" title="Customer First" text="Every decision we make starts with one question: does it make shopping easier for our customers?" />
            <ValueCard icon="🤝" title="Trust & Honesty" text="Verified payments, transparent pricing, and real reviews from real buyers — no tricks, no hidden fees." />
            <ValueCard icon="💡" title="Innovation" text="From instant order tracking to secure checkout, we keep improving the way Nigeria shops online." />
            <ValueCard icon="🌍" title="Accessibility" text="We're committed to making quality products available to everyone, no matter where they live." />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Step number="1" title="Create your account" text="Sign up in seconds. It's free and keeps your orders and delivery details safe." />
          <Step number="2" title="Shop your favourites" text="Browse products, read verified reviews, and add what you love to your cart." />
          <Step number="3" title="Pay securely & relax" text="Check out safely with Paystack, then track your order until it reaches your door." />
        </div>
      </section>

      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">What Our Customers Say</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Testimonial quote="Fast delivery and the product was exactly as described. Shopping here feels safe." name="Amaka O." />
            <Testimonial quote="The reviews helped me pick the right size the first time. Brilliant feature!" name="Tunde B." />
            <Testimonial quote="Free delivery made all the difference. I order from ShopHub every month now." name="Chidinma E." />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to shop with us now?</h2>
        <p className="text-gray-500 mb-6">
          Join thousands of happy customers and get your favourite products delivered free to your door.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/products" className="bg-primary hover:bg-primary-hover text-white font-semibold px-8 py-3 rounded-xl transition-colors">
            Start Shopping
          </Link>
          <Link to="/register" className="border border-gray-300 text-gray-700 font-semibold px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors">
            Create an Account
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Get in Touch</h2>
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 max-w-xl mx-auto text-center">
          <p className="text-gray-600 mb-2"><strong>Email:</strong> support@shophub.com</p>
          <p className="text-gray-600 mb-2"><strong>Phone:</strong> (+234) 916-4794-335</p>
          <p className="text-gray-600"><strong>Address:</strong> 1 Commerce St, Lagos, Nigeria.</p>
        </div>
      </section>
    </div>
  );
}

function Feature({ icon, text }) {
  return (
    <li className="flex items-center gap-3 text-gray-700">
      <span className="text-lg">{icon}</span>
      <span className="text-sm">{text}</span>
    </li>
  );
}

function ValueCard({ icon, title, text }) {
  return (
    <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  );
}

function Step({ number, title, text }) {
  return (
    <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
      <div className="w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm mb-3">
        {number}
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  );
}

function Testimonial({ quote, name }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <p className="text-gray-600 italic mb-4 leading-relaxed">&ldquo;{quote}&rdquo;</p>
      <strong className="text-primary text-sm">— {name}</strong>
    </div>
  );
}
