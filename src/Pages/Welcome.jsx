import Logo from "../components/Logo";

function WelcomeBlog() {
  return (
    <section className="w-full bg-white min-h-screen">
      {/* Header */}
      <header className="max-w-3xl mx-auto  border-b border-gray-200 bg-white  flex  items-center gap-3">
        <div className="px-6 py-5">
          <Logo />
        </div>
        <span className="text-lg font-semibold text-gray-800 tracking-tight">
          E-Mart News
        </span>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Article Title */}
        <h1 className="text-4xl font-bold text-gray-900 leading-tight tracking-tight">
          E-Mart Introduces a Modern Shopping Experience for Everyone
        </h1>

        {/* Meta Info */}
        <div className="mt-3 text-sm text-gray-500">
          Published on March 17, 2026 • 5 min read
        </div>

        {/* Article Body */}
        <div className="mt-8 space-y-6 text-gray-700 text-lg leading-relaxed">
          <p>
            <strong>E-Mart</strong>, a next-generation ecommerce platform, has
            officially launched with the goal of delivering a seamless and
            premium shopping experience. Built using modern technologies, the
            platform ensures speed, performance, and reliability.
          </p>

          <p>
            Customers can explore a wide range of premium products curated
            carefully to meet modern shopping expectations. The clean and
            intuitive interface allows users to browse products easily and
            complete purchases with minimal effort.
          </p>

          <p>
            One of the platform’s key strengths is its fully responsive design.
            Whether on desktop, tablet, or mobile, users enjoy a consistent and
            smooth experience. Secure payment integration ensures safe and
            trusted transactions.
          </p>

          <p>
            The E-Mart development team has focused heavily on performance
            optimization and user experience. Fast loading speeds and modern UI
            design help customers shop efficiently and comfortably.
          </p>
        </div>

        {/* Highlights Section */}
        <section className="mt-12 bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Key Highlights
          </h2>

          <ul className="space-y-3 text-gray-700">
            <li>✔ Premium quality curated products</li>
            <li>✔ Secure and reliable payment system</li>
            <li>✔ Fully responsive modern design</li>
            <li>✔ High performance powered by React</li>
          </ul>
        </section>

        {/* Statistics */}
        <section className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Platform Statistics
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">10K+</div>
              <div className="text-sm text-gray-500 mt-1">Happy Customers</div>
            </div>

            <div>
              <div className="text-2xl font-bold text-gray-900">500+</div>
              <div className="text-sm text-gray-500 mt-1">Premium Products</div>
            </div>

            <div>
              <div className="text-2xl font-bold text-gray-900">24/7</div>
              <div className="text-sm text-gray-500 mt-1">Customer Support</div>
            </div>

            <div>
              <div className="text-2xl font-bold text-gray-900">100%</div>
              <div className="text-sm text-gray-500 mt-1">Secure Payments</div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500">
          © 2026 E-Mart. All rights reserved.
        </footer>
      </main>
    </section>
  );
}

export default WelcomeBlog;
