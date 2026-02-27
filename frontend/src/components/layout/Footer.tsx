export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-12 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-6xl py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Creator Info */}
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">Built by Esha Kampannu</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              AI Engineer Intern Technical Assessment — Full Stack (Assessment #1 & #2)
            </p>
          </div>

          {/* PM Accelerator Info */}
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
              <a
                href="https://www.linkedin.com/company/product-manager-accelerator"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Product Manager Accelerator (PMA)
              </a>
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              PM Accelerator is the world&apos;s most comprehensive AI product management program, empowering
              aspiring and experienced PMs to break into top companies, accelerate their careers, and
              build AI-first products through mentorship, real-world projects, and community-driven learning.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
