import { Fragment } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function DisclaimerDrawer({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <Fragment>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      {/* Bottom Drawer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#020617] border-t border-gray-200 dark:border-gray-700 max-h-[80vh] overflow-y-auto transition-transform">
        <div className="max-w-4xl mx-auto px-6 py-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Risk Disclosure & Disclaimer
            </h2>

            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-4 leading-relaxed">
            <p>
              <strong>Risk Disclosure:</strong> The Content and this Dashboard
              is not intended to provide, and does not constitute, financial,
              investment, trading, tax, legal, or any other form of professional
              advice. It is not a recommendation, solicitation, or offer to buy,
              sell, trade, or hold any securities, event contracts, derivatives,
              cryptocurrencies, or other financial instruments.
            </p>

            <p>
              Prediction Market Edge believes the Content and Dashboard is
              reliable but makes no representations or warranties as to its
              accuracy, completeness, timeliness, or suitability for any
              purpose. Content is subject to change without notice.
            </p>

            <p>
              Trading in prediction markets involves significant risk of loss,
              including the potential loss of your entire investment. Past
              performance is not indicative of future results.
            </p>

            <p>
              Subscribers should conduct their own independent research and
              consult qualified professionals before making any trading or
              investment decisions.
            </p>

            <p>
              Prediction Market Edge is not responsible for third-party
              platforms, data, rules, or services referenced, including
              Polymarket, Kalshi, or other exchanges.
            </p>

            <p>
              By accessing this Dashboard or Newsletter, you agree that
              Prediction Market Edge shall not be liable for any damages arising
              from your use of the Content.
            </p>

            <p>
              For additional information, review our Terms of Service, Privacy
              Policy, and Subscription Agreement available at{" "}
              <a
                href="https://predictionmarketedge.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                predictionmarketedge.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
