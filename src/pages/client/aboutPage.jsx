import {
  FaStar,
  FaHeart,
  FaUsers,
  FaAward,
  FaLeaf,
  FaGlobe,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";

function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="px-4 py-20">
        <div className="mx-auto w-[90%] lg:w-[80%]">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-pink-100 px-4 py-2 text-sm font-medium text-pink-800">
                <FaStar className="h-4 w-4" />
                Our Story
              </div>
              <h1 className="mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text text-4xl font-bold text-transparent md:text-5xl lg:text-6xl">
                About Crystal Beauty Clear
              </h1>
              <p className="text-lg leading-relaxed text-gray-600 md:text-xl">
                Bringing you high-quality beauty products for every skin tone,
                every occasion, and every confident soul.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 rotate-3 transform rounded-2xl bg-gradient-to-r from-pink-400 to-purple-400"></div>
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src="/about-section-hero.jpg"
                    alt="Crystal Beauty Clear hero image"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-4 py-16">
        <div className="mx-auto w-[90%] lg:w-[80%]">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="lg:order-2">
              <h2 className="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">
                Our Mission
              </h2>
              <p className="mb-6 text-lg leading-relaxed text-gray-600">
                At Crystal Beauty Clear, we believe that true beauty comes from
                confidence, and confidence comes from feeling comfortable in
                your own skin. Our mission is to provide premium beauty products
                that celebrate diversity, enhance natural beauty, and empower
                individuals to express their unique style.
              </p>
              <p className="text-lg leading-relaxed text-gray-600">
                We're committed to creating inclusive beauty solutions that work
                for everyone, regardless of skin tone, age, or personal style.
                Every product in our collection is carefully curated to meet the
                highest standards of quality and effectiveness.
              </p>
              <div className="mt-8 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 p-1">
                <div className="rounded-xl bg-white p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500">
                      <FaHeart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Beauty for All
                      </h3>
                      <p className="text-gray-600">
                        Every confident soul deserves to shine
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:order-1">
              <div className="relative">
                <div className="absolute inset-0 -rotate-3 transform rounded-2xl bg-gradient-to-r from-purple-400 to-pink-400"></div>
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src="/about-section-mission.jpg"
                      alt="Our mission - inclusive beauty"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto w-[90%] lg:w-[80%]">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 md:text-xl">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="group text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500 transition-transform duration-300 group-hover:scale-110">
                <FaAward className="h-10 w-10 text-white" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-gray-900 md:text-2xl">
                Quality First
              </h3>
              <p className="leading-relaxed text-gray-600">
                We never compromise on quality. Every product undergoes rigorous
                testing to ensure it meets our high standards and delivers
                exceptional results.
              </p>
            </div>

            <div className="group text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-transform duration-300 group-hover:scale-110">
                <FaUsers className="h-10 w-10 text-white" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-gray-900 md:text-2xl">
                Inclusive Beauty
              </h3>
              <p className="leading-relaxed text-gray-600">
                Beauty has no boundaries. We celebrate diversity and create
                products that work beautifully for all skin tones and types.
              </p>
            </div>

            <div className="group text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500 transition-transform duration-300 group-hover:scale-110">
                <FaLeaf className="h-10 w-10 text-white" />
              </div>
              <h3 className="mb-4 text-xl font-bold text-gray-900 md:text-2xl">
                Sustainability
              </h3>
              <p className="leading-relaxed text-gray-600">
                We care about our planet. Our commitment to sustainable
                practices ensures that beauty and environmental responsibility
                go hand in hand.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section with Images */}
      <section className="px-4 py-16">
        <div className="mx-auto w-[90%] lg:w-[80%]">
          <div className="space-y-12">
            {/* Second Story Card */}
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div className="relative lg:order-2">
                <div className="aspect-[4/3] overflow-hidden rounded-xl">
                  <img
                    src="/about-group.jpg"
                    alt="Our community and team"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-xl md:p-8 lg:order-1">
                <h3 className="mb-4 text-2xl font-bold text-gray-900">
                  Our Team
                </h3>
                <p className="leading-relaxed text-gray-600">
                  Our journey began when we noticed a gap in the market for
                  truly inclusive beauty products. Too many people were left out
                  of the beauty conversation, and we knew we had to change that.
                  We set out to create a brand that would speak to every
                  confident soul.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="mb-16 bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-16">
        <div className="mx-auto w-[90%] text-center lg:w-[80%]">
          <div className="mb-8">
            <img
              src="/logo-inverted.png"
              alt="cbc-logo"
              className="mx-auto mb-8 w-100"
            />
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Ready to Join Our Beauty Community?
            </h2>
            <p className="mb-8 text-lg text-pink-100 md:text-xl">
              Discover products that celebrate your unique beauty and boost your
              confidence.
            </p>
          </div>

          <div className="grid gap-6 text-white md:grid-cols-3">
            <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm transition-colors duration-300 hover:bg-white/20">
              <FaMapMarkerAlt className="mx-auto mb-3 h-8 w-8" />
              <h3 className="mb-2 font-semibold">Visit Us</h3>
              <p className="text-pink-100">
                123 Glow Avenue, Colombo, Sri Lanka
              </p>
            </div>
            <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm transition-colors duration-300 hover:bg-white/20">
              <FaPhone className="mx-auto mb-3 h-8 w-8" />
              <h3 className="mb-2 font-semibold">Call Us</h3>
              <p className="text-pink-100">+94 71 234 5678</p>
            </div>
            <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm transition-colors duration-300 hover:bg-white/20">
              <FaEnvelope className="mx-auto mb-3 h-8 w-8" />
              <h3 className="mb-2 font-semibold">Email Us</h3>
              <p className="text-pink-100">hello@crystalbeautyclear.com</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
//why doesn't this work?
export default AboutPage;