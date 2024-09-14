import { useState } from 'preact/hooks'
import { useTranslation } from 'react-i18next';

export default function InfoBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const { t } = useTranslation();

  if (!isVisible) return null

  return (
    <div className="bg-red-100 text-red-800 py-3 px-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-3 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <span className="font-medium text-sm">{t('early_development_notice')}</span>
      </div>
      <div className="flex items-center">
        <a
          href="https://github.com/pazdikan/fixer"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-sm font-medium text-red-700 hover:text-red-900 transition-colors duration-200"
        >
          {t('view_on_github')}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </a>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 text-red-500 hover:text-red-700 transition-colors duration-200"
          aria-label="Close banner"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}