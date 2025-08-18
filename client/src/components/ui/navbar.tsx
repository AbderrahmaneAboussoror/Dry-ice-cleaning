// src/components/ui/navbar.tsx
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/croped-logo-free-bg.png";
import { authService } from "@/services/authService";
import type { User } from "@/types/auth";

interface Navigation {
    name: string;
    href?: string;
    action?: () => void;
    type: 'link' | 'scroll';
    sectionId?: string; // Add this to track which section this nav item represents
}

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<string>('home');
    const navigate = useNavigate();
    const location = useLocation();
    const userMenuRef = useRef<HTMLDivElement>(null);

    // Check authentication state
    const isAuthenticated = authService.isAuthenticated();
    const currentUser: User | null = authService.getCurrentUser();

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Scroll spy effect to detect active section
    useEffect(() => {
        const handleScroll = () => {
            // Only run scroll spy on home page
            if (location.pathname !== '/') {
                setActiveSection('');
                return;
            }

            const sections = ['home', 'services', 'appointment', 'about-us', 'contact'];
            const scrollPosition = window.scrollY + 100; // Offset for better detection

            // Check if we're at the very top
            if (window.scrollY < 50) {
                setActiveSection('home');
                return;
            }

            for (const sectionId of sections) {
                const section = document.getElementById(sectionId);
                if (section) {
                    const offsetTop = section.offsetTop;
                    const offsetBottom = offsetTop + section.offsetHeight;

                    if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
                        setActiveSection(sectionId);
                        break;
                    }
                }
            }
        };

        // Set initial active section
        if (location.pathname === '/') {
            handleScroll();
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        } else {
            setActiveSection('');
        }
    }, [location.pathname]);

    // Smooth scroll methods
    const scrollToSection = (sectionId: string) => {
        // If not on home page, navigate to home first
        if (location.pathname !== '/') {
            navigate('/');
            // Wait for navigation to complete then scroll
            setTimeout(() => {
                const section = document.getElementById(sectionId);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        } else {
            // Already on home page, just scroll
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        }
        setIsOpen(false);
    };

    const scrollToHome = () => {
        if (location.pathname !== '/') {
            navigate('/');
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        setIsOpen(false);
    };

    // Placeholder for future points purchase section scroll
    const scrollToPointsPurchase = () => {
        // TODO: Implement when points purchase section is created
        console.log('Scrolling to points purchase section...');
        setIsOpen(false);
    };

    // Base navigation items (always shown)
    const baseNavigation: Navigation[] = [
        {
            name: "home",
            type: 'scroll',
            action: scrollToHome,
            sectionId: 'home',
        },
        {
            name: "services",
            type: 'scroll',
            action: () => scrollToSection('services'),
            sectionId: 'services',
        },
        {
            name: "booking",
            type: 'scroll',
            action: () => scrollToSection('appointment'),
            sectionId: 'appointment',
        },
        {
            name: "about us",
            type: 'scroll',
            action: () => scrollToSection('about-us'),
            sectionId: 'about-us',
        },
        {
            name: "contact",
            type: 'scroll',
            action: () => scrollToSection('contact'),
            sectionId: 'contact',
        },
    ];

    // Authenticated user navigation items
    const authenticatedNavigation: Navigation[] = [
        ...baseNavigation,
        // {
        //   name: "profile",
        //   type: 'link',
        //   href: "/profile",
        // },
    ];

    // Non-authenticated user navigation items
    const guestNavigation: Navigation[] = [
        ...baseNavigation,
        // {
        //   name: "login",
        //   type: 'link',
        //   href: "/login",
        // },
    ];

    // Choose navigation based on auth state
    const navigation = isAuthenticated ? authenticatedNavigation : guestNavigation;

    const handleNavClick = (nav: Navigation) => {
        if (nav.type === 'scroll' && nav.action) {
            nav.action();
        } else if (nav.type === 'link' && nav.href) {
            navigate(nav.href);
            setIsOpen(false);
        }
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
            navigate('/');
            setIsOpen(false);
            setIsUserMenuOpen(false);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleProfileClick = () => {
        navigate('/profile');
        setIsUserMenuOpen(false);
    };

    // Helper function to determine if a nav item is active
    const isNavActive = (nav: Navigation) => {
        if (nav.type === 'link' && nav.href) {
            return location.pathname === nav.href;
        }
        if (nav.type === 'scroll' && nav.sectionId) {
            return activeSection === nav.sectionId && location.pathname === '/';
        }
        return false;
    };

    // Helper function to get nav item classes
    const getNavItemClasses = (nav: Navigation, isMobile: boolean = false) => {
        const baseClasses = isMobile
            ? "block w-full text-left capitalize text-sm py-2 transition-colors"
            : "capitalize text-sm transition-colors cursor-pointer";

        const activeClasses = "text-[#26687D] font-medium";
        const inactiveClasses = "hover:text-[#26687D]";

        return isNavActive(nav)
            ? `${baseClasses} ${activeClasses}`
            : `${baseClasses} ${inactiveClasses}`;
    };

    return (
        <div className="w-full">
            {/* Desktop Navigation */}
            <div className="hidden md:flex flex-col items-center justify-center gap-5 py-4">
                {/* Logo - centered */}
                <div className="h-14 cursor-pointer" onClick={scrollToHome}>
                    <img className="w-full h-full object-contain" src={logo} alt="Logo" />
                </div>

                {/* Navigation menu */}
                <div className="flex items-center justify-center gap-10">
                    {navigation.map((nav, i) => (
                        <button
                            key={i}
                            onClick={() => handleNavClick(nav)}
                            className={getNavItemClasses(nav)}
                        >
                            {nav.name}
                        </button>
                    ))}

                    {/* User Menu Dropdown */}
                    {isAuthenticated && currentUser ? (
                        <div className="relative ml-4 pl-4 border-l border-gray-300" ref={userMenuRef}>
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center gap-2 text-sm hover:text-[#26687D] transition-colors"
                            >
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-xs">
                    {currentUser.firstName.charAt(0)}{currentUser.lastName.charAt(0)}
                  </span>
                                </div>
                                <span className="capitalize">{currentUser.firstName}</span>
                                <svg
                                    className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                    {/* User Info */}
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-medium text-gray-900">
                                            {currentUser.firstName} {currentUser.lastName}
                                        </p>
                                        <p className="text-sm text-gray-500">{currentUser.email}</p>
                                    </div>

                                    {/* Points Section */}
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {currentUser.totalPoints} Points
                                                    </p>
                                                    <p className="text-xs text-gray-500">Available balance</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={scrollToPointsPurchase}
                                                className="text-blue-600 hover:text-[#26687D] transition-colors p-1"
                                                title="Purchase more points"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Menu Items */}
                                    <div className="py-1">
                                        <button
                                            onClick={handleProfileClick}
                                            className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 transition-colors ${
                                                location.pathname === '/profile'
                                                    ? 'text-[#26687D] bg-blue-50 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Profile
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Show login button for non-authenticated users
                        <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-300">
                            <button
                                onClick={() => navigate('/login')}
                                className={`text-sm transition-colors px-3 py-1 ${
                                    location.pathname === '/login'
                                        ? 'text-[#26687D] font-medium'
                                        : 'hover:text-[#26687D]'
                                }`}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className={`text-sm border border-[#26687D] transition-colors px-4 py-2 rounded-lg font-medium ${
                                    location.pathname === '/register'
                                        ? 'text-white bg-[#26687D]'
                                        : 'text-[#26687D] bg-transparent hover:bg-[#26687D] hover:text-white'
                                }`}
                            >
                                Sign Up
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
                {/* Mobile Header */}
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="h-10 cursor-pointer" onClick={scrollToHome}>
                        <img
                            className="w-full h-full object-contain"
                            src={logo}
                            alt="Logo"
                        />
                    </div>

                    {/* Mobile points display */}
                    <div className="flex items-center gap-3">
                        {isAuthenticated && currentUser && (
                            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                <span className="text-blue-600 font-medium text-sm">
                  {currentUser.totalPoints}
                </span>
                                <button
                                    onClick={scrollToPointsPurchase}
                                    className="text-blue-600 hover:text-blue-800 transition-colors"
                                    title="Purchase more points"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                        />
                                    </svg>
                                </button>
                            </div>
                        )}

                        {/* Hamburger Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex flex-col justify-center items-center w-8 h-8 space-y-1"
                            aria-label="Toggle menu"
                        >
              <span
                  className={`w-6 h-0.5 bg-gray-600 transition-all duration-300 ${
                      isOpen ? "rotate-45 translate-y-2" : ""
                  }`}
              />
                            <span
                                className={`w-6 h-0.5 bg-gray-600 transition-all duration-300 ${
                                    isOpen ? "opacity-0" : ""
                                }`}
                            />
                            <span
                                className={`w-6 h-0.5 bg-gray-600 transition-all duration-300 ${
                                    isOpen ? "-rotate-45 -translate-y-2" : ""
                                }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                    <div className="px-4 py-2 bg-gray-50 border-t">
                        {navigation.map((nav, i) => (
                            <div key={i} className="py-2">
                                <button
                                    onClick={() => handleNavClick(nav)}
                                    className={getNavItemClasses(nav, true)}
                                >
                                    {nav.name}
                                </button>
                            </div>
                        ))}

                        {/* Mobile User Info & Logout */}
                        {isAuthenticated && currentUser && (
                            <div className="py-2 border-t border-gray-200 mt-2">
                                <button
                                    onClick={handleProfileClick}
                                    className={`block text-sm py-2 transition-colors ${
                                        location.pathname === '/profile'
                                            ? 'text-[#26687D] font-medium'
                                            : 'text-gray-700 hover:text-[#26687D]'
                                    }`}
                                >
                                    Profile
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="block text-sm text-red-600 hover:text-red-800 transition-colors py-2"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;