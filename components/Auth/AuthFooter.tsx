'use client'

interface AuthFooterProps {
    showCopyright?: boolean
    className?: string
}

export default function AuthFooter({ showCopyright = true, className = '' }: AuthFooterProps) {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer className={`absolute bottom-0 left-0 right-0 w-full z-20 ${className}`}>
            {/* Horizontal border line - light gray, 85% width with margins matching Figma */}
            <div className="h-px bg-gray-400/50 w-[84%] mx-6 sm:mx-12 md:mx-12 lg:mx-24"></div>

            {/* Footer content - exactly aligned with border width and margins */}
            <div className="flex flex-col sm:flex-row items-center justify-between w-[84%] mx-6 sm:mx-12 md:mx-12 lg:mx-24 pt-3 sm:pt-4 pb-2 sm:pb-3 text-white">
                {/* Left side - Copyright text, left-aligned */}
                {showCopyright && (
                    <div className="text-white font-exo2 text-sm sm:text-base text-left">
                        © {currentYear} 21 Spades. All Rights Reserved.
                    </div>
                )}

                {/* Right side - Navigation links, right-aligned */}
                <div className="flex items-center gap-4 sm:gap-5 md:gap-6 mt-3 sm:mt-0">
                    <button className="text-white font-exo2 hover:text-gray-300 transition-colors font-normal whitespace-nowrap text-sm sm:text-base">
                        Marketplace
                    </button>
                    <button className="text-white font-exo2 hover:text-gray-300 transition-colors font-normal whitespace-nowrap text-sm sm:text-base">
                        License
                    </button>
                    <button className="text-white font-exo2 hover:text-gray-300 transition-colors font-normal whitespace-nowrap text-sm sm:text-base">
                        Terms of Use
                    </button>
                </div>
            </div>
        </footer>
    )
}
