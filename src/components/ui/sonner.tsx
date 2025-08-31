import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-gray-900 group-[.toaster]:border group-[.toaster]:border-gray-200 group-[.toaster]:shadow-lg group-[.toaster]:backdrop-blur-sm group-[.toaster]:rounded-xl group-[.toaster]:p-4",
          description: "group-[.toast]:text-gray-600 group-[.toast]:text-sm group-[.toast]:mt-1",
          actionButton:
            "group-[.toast]:bg-black group-[.toast]:text-white group-[.toast]:hover:bg-gray-800 group-[.toast]:rounded-lg group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:text-sm group-[.toast]:font-medium group-[.toast]:transition-all group-[.toast]:duration-200",
          cancelButton:
            "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-700 group-[.toast]:hover:bg-gray-200 group-[.toast]:rounded-lg group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:text-sm group-[.toast]:font-medium group-[.toast]:transition-all group-[.toast]:duration-200",
          closeButton:
            "group-[.toast]:bg-white group-[.toast]:border group-[.toast]:border-gray-200 group-[.toast]:text-gray-500 group-[.toast]:hover:text-gray-700 group-[.toast]:hover:bg-gray-50 group-[.toast]:rounded-full group-[.toast]:w-6 group-[.toast]:h-6 group-[.toast]:flex group-[.toast]:items-center group-[.toast]:justify-center group-[.toast]:transition-all group-[.toast]:duration-200",
          success:
            "group-[.toast]:border-gray-300 group-[.toast]:bg-gray-100 group-[.toast]:text-black",
          error:
            "group-[.toast]:border-gray-400 group-[.toast]:bg-gray-200 group-[.toast]:text-black",
          warning:
            "group-[.toast]:border-gray-300 group-[.toast]:bg-gray-100 group-[.toast]:text-black",
          info:
            "group-[.toast]:border-gray-300 group-[.toast]:bg-gray-100 group-[.toast]:text-black",
          title: "group-[.toast]:text-sm group-[.toast]:font-semibold group-[.toast]:flex group-[.toast]:items-center group-[.toast]:gap-2",
          icon: "group-[.toast]:w-5 group-[.toast]:h-5 group-[.toast]:shrink-0",
        },
      }}
      icons={{
        success: (
          <div className="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ),
        error: (
          <div className="w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        ),
        warning: (
          <div className="w-5 h-5 bg-gray-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        ),
        info: (
          <div className="w-5 h-5 bg-gray-600 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        ),
      }}
      {...props}
    />
  )
}

export { Toaster }
