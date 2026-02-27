export default function Footer() {
  return (
    <footer className="bg-white/30 dark:bg-gray-900/40 backdrop-blur-md border-t border-white/50 dark:border-white/10 mt-12 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-6xl py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
              Ekamnoor Singh Pannu
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Computer Science Student at York University
            </p>
          </div>
          <div className="text-right">
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
              PM Accelerator
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs sm:text-right">
              Product management training and career accelerator program empowering the next generation of product leaders.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
