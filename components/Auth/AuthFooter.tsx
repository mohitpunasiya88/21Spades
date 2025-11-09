'use client'

interface AuthFooterProps {
    showCopyright?: boolean
    className?: string
}

export default function AuthFooter({ showCopyright = true, className = '' }: AuthFooterProps) {
    return (
        <footer className={`relative md:absolute md:bottom-0 md:left-0 md:right-0 w-full  ${className}`}>
            {/* Horizontal line above footer */}
            <div className="h-px bg-gray-600 w-[85%] mx-6 sm:mx-12 md:mx-12 lg:mx-24"></div>

            {/* Footer content */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 text-[10px] sm:text-xs text-white mx-3 sm:mx-6 md:mx-6 gap-2 sm:gap-3 md:gap-0">
                {/* Left side - Copyright */}
                {showCopyright && (
                    <div className="text-white font-exo2 text-center sm:text-left sm:text-lg mx-0 sm:mx-12">
                        © 2025 21 Spades. All Rights Reserved.
                    </div>
                )}

                {/* Right side - Links */}
                <div className="flex gap-2 sm:gap-3 md:gap-4 flex-wrap justify-center sm:justify-end  sm:mx-4 md:mx-12">
                    <button className="text-white font-exo2 hover:text-gray-300 transition-colors font-normal whitespace-nowrap text-[10px] sm:text-xs py-1">
                        Marketplace
                    </button>
                    <button className="text-white font-exo2 hover:text-gray-300 transition-colors font-normal whitespace-nowrap text-[10px] sm:text-xs py-1">
                        License
                    </button>
                    <button className="text-white font-exo2 hover:text-gray-300 transition-colors font-normal whitespace-nowrap text-[10px] sm:text-xs py-1">
                        Terms of Use
                    </button>
                </div>
            </div>
        </footer>
    )
}
