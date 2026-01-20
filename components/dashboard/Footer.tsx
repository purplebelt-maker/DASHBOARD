import { memo, useState } from "react";
import DisclaimerDrawer from "../DisclaimerDrawer";

function Footer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <footer className="mt-4 bg-gray-50 dark:bg-[#0f172a] border-t border-gray-200 dark:border-gray-700 py-6 transition-colors duration-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-3">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              © Prediction Market Edge • Exclusive for subscribers • Not
              financial advice
            </p>

            <div className="flex items-center space-x-2 text-sm">
              <a
                href="#"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Privacy Policy
              </a>

              <span className="text-gray-400">•</span>

              <button
                onClick={() => setOpen(true)}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Disclaimer
              </button>
            </div>
          </div>
        </div>
      </footer>

      <DisclaimerDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export default memo(Footer);
