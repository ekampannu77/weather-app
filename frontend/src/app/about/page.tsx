export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      {/* Creator Section */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">👩‍💻 About This App</h1>

        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-3xl flex-shrink-0">
            🧑‍💻
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Esha Kampannu</h2>
            <p className="text-blue-600 font-medium">AI Engineer Intern Candidate</p>
            <p className="text-gray-600 mt-2 text-sm leading-relaxed">
              This weather application was built as part of the PM Accelerator AI Engineer Intern
              Technical Assessment. It demonstrates Full Stack capabilities covering both
              Assessment #1 (Frontend) and Assessment #2 (Backend).
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: '⚛️', label: 'Frontend', desc: 'Next.js 14 + React + TypeScript + Tailwind CSS' },
            { icon: '☕', label: 'Backend', desc: 'Java 21 + Spring Boot 3 + Maven' },
            { icon: '🗄️', label: 'Database', desc: 'PostgreSQL 16 with Flyway migrations' },
            { icon: '🌐', label: 'APIs', desc: 'OpenWeatherMap, Open-Meteo, YouTube, Google Maps' },
          ].map(({ icon, label, desc }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-3 flex gap-3">
              <span className="text-2xl">{icon}</span>
              <div>
                <p className="font-semibold text-gray-700 text-sm">{label}</p>
                <p className="text-gray-500 text-xs">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PM Accelerator Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">🚀</span>
          <div>
            <h2 className="text-xl font-bold">Product Manager Accelerator</h2>
            <a
              href="https://www.linkedin.com/company/product-manager-accelerator"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-200 text-sm hover:text-white transition-colors"
            >
              linkedin.com/company/product-manager-accelerator →
            </a>
          </div>
        </div>

        <p className="text-blue-100 leading-relaxed">
          Product Manager Accelerator (PMA) is the world&apos;s most comprehensive AI product management
          program, empowering aspiring and experienced PMs to break into top companies, accelerate
          their careers, and build AI-first products. Through structured mentorship from industry
          leaders, hands-on real-world projects, and a thriving community of thousands of PMs
          worldwide, PMA bridges the gap between ambition and achievement in the product management
          profession.
        </p>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
          {[
            { stat: '10,000+', label: 'Community Members' },
            { stat: 'Top 10', label: 'PM Programs Globally' },
            { stat: 'AI-First', label: 'Curriculum' },
          ].map(({ stat, label }) => (
            <div key={label} className="bg-blue-700/50 rounded-xl p-3">
              <p className="text-xl font-bold">{stat}</p>
              <p className="text-blue-200 text-xs">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">✅ Features Implemented</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            'Location search (city, ZIP, GPS, landmark)',
            'Auto-detect current location (GPS)',
            'Real-time current weather display',
            '5-day forecast with rain probability',
            'Temperature unit toggle (°C / °F)',
            'Google Maps embed for searched location',
            'YouTube travel videos for location',
            'Historical weather queries (CRUD)',
            'Location validation via geocoding',
            'Date range validation',
            'Data export: JSON, CSV, XML, PDF, Markdown',
            'Responsive design (mobile, tablet, desktop)',
            'Error handling with user-friendly messages',
            'PostgreSQL persistence with Flyway migrations',
            'RESTful API with Swagger documentation',
          ].map((feat) => (
            <div key={feat} className="flex items-center gap-2 text-sm text-gray-700">
              <span className="text-green-500">✓</span>
              {feat}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
