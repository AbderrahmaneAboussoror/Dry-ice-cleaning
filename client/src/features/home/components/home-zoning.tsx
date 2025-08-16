import logo from "../../../../public/croped-logo-free-bg.png";
import { useState } from "react";

const HomeZoning = () => {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    const testimonials = [
        {
            name: "Mike Johnson",
            location: "Copenhagen",
            text: "Amazing service! My engine bay looks brand new after the dry ice cleaning.",
            rating: 5
        },
        {
            name: "Sarah Chen",
            location: "Aarhus",
            text: "Eco-friendly and incredibly effective. Highly recommend!",
            rating: 5
        },
        {
            name: "Lars Nielsen",
            location: "Odense",
            text: "Professional team, quick service, and excellent results.",
            rating: 5
        }
    ];

    const nextTestimonial = () => {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const handleBookNow = () => {
        // Scroll to appointment section
        const appointmentSection = document.getElementById('appointment');
        if (appointmentSection) {
            appointmentSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="border border-gray-300 w-[90vw] max-w-[900px] bg-white rounded-3xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
                <div className="h-14">
                    <img className="w-full h-full object-contain" src={logo} alt="GlaciX Logo" />
                </div>
                <button
                    onClick={handleBookNow}
                    className="bg-cyan hover:bg-sky-300 text-gray-800 px-8 py-2 rounded-xl transition-colors"
                >
                    Book Now
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="col-span-1 md:col-span-2 lg:col-span-3 space-y-6">

                    {/* Hero Content Area */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl h-64 w-full p-6 flex flex-col justify-center">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-green-700">Mobile Service Available</span>
                            </div>

                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 leading-tight">
                                Professional Dry Ice Engine Bay Cleaning
                            </h2>

                            <p className="text-gray-600 text-sm md:text-base">
                                Transform your engine bay with our eco-friendly dry ice cleaning technology.
                                No chemicals, no water damage, just pristine results.
                            </p>

                            <div className="flex items-center space-x-6 pt-2">
                                <div className="flex items-center space-x-2">
                                    <svg className="w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm text-gray-700">Chemical-free</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <svg className="w-5 h-5 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-sm text-gray-700">Safe & Fast</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Why Choose Us / Benefits */}
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl h-64 w-full p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Why Dry Ice Cleaning?</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                            <div className="space-y-3">
                                <div className="flex items-start space-x-3">
                                    <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 text-sm">Environmentally Safe</h4>
                                        <p className="text-xs text-gray-600">No harmful chemicals or waste residue</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 text-sm">Time Efficient</h4>
                                        <p className="text-xs text-gray-600">Quick cleaning without disassembly</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-start space-x-3">
                                    <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 text-sm">Deep Clean</h4>
                                        <p className="text-xs text-gray-600">Removes grease, oil, and carbon deposits</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 text-sm">No Damage</h4>
                                        <p className="text-xs text-gray-600">Safe for electrical components</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Customer Testimonials & Quick Stats */}
                <div className="col-span-1">
                    <div className="bg-gradient-to-b from-cyan-50 to-blue-50 rounded-xl h-full p-4 flex flex-col">

                        {/* Quick Stats */}
                        <div className="mb-6">
                            <h3 className="font-bold text-gray-800 text-sm mb-3">Our Track Record</h3>
                            <div className="space-y-3">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-cyan-600">500+</div>
                                    <div className="text-xs text-gray-600">Engines Cleaned</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-cyan-600">98%</div>
                                    <div className="text-xs text-gray-600">Customer Satisfaction</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-cyan-600">2hr</div>
                                    <div className="text-xs text-gray-600">Average Service Time</div>
                                </div>
                            </div>
                        </div>

                        {/* Customer Testimonial */}
                        <div className="bg-white rounded-lg p-4 shadow-sm flex-1">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold text-gray-800 text-sm">Customer Review</h4>
                                <div className="flex space-x-1">
                                    <button
                                        onClick={prevTestimonial}
                                        className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xs transition-colors"
                                    >
                                        ←
                                    </button>
                                    <button
                                        onClick={nextTestimonial}
                                        className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-xs transition-colors"
                                    >
                                        →
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex text-yellow-400 text-sm">
                                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                                        <span key={i}>★</span>
                                    ))}
                                </div>

                                <p className="text-gray-700 text-sm italic">
                                    "{testimonials[currentTestimonial].text}"
                                </p>

                                <div className="text-xs text-gray-600">
                                    <div className="font-semibold">{testimonials[currentTestimonial].name}</div>
                                    <div>{testimonials[currentTestimonial].location}</div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="mt-4 text-center">
                            <div className="text-xs text-gray-600 space-y-1">
                                <div>📞 +45 91 11 96 54</div>
                                <div>📧 info@glacix.dk</div>
                                <div className="text-green-600 font-medium">Available 24/7</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeZoning;