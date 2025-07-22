import logo from "../assets/intellikitlogo.png"

export default function Footer() {
    return (
        <footer className="px-6 md:px-16 lg:px-24 xl:px-32 pt-8 w-full text-gray-500">
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500/30 pb-6">
                <div className="md:max-w-96">
                    <img src={logo} alt="logo" className="w-40" />
                    <p className="mt-6 text-sm">
                        IntelliKit is your all-in-one AI toolkit — from writing articles and reviewing resumes to removing backgrounds and enhancing images. Create smarter, faster, and better with powerful AI tools at your fingertips.
                    </p>
                </div>
                <div className="flex-1 flex items-start md:justify-end gap-20">
                    <div>
                        <h2 className="font-semibold mb-5 text-gray-800">Resources</h2>
                        <ul className="text-sm space-y-2">
                            <li className="hover:underline transition-opacity duration-300"><a href="#home">Home</a></li>
                            <li className="hover:underline transition duration-300"><a href="#tools">Tools</a></li>
                            <li className="hover:underline transition duration-300"><a href="#reviews">Reviews</a></li>
                            <li className="hover:underline transition duration-300"><a href="#plans">Plans</a></li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-semibold mb-5 text-gray-800">Get in touch</h2>
                        <div className="text-sm space-y-2">
                            <p>+0-000-000-0000</p>
                            <p>intellikit@example.com</p>
                        </div>
                    </div>
                </div>
            </div>
            <p className="pt-4 text-center text-xs md:text-sm pb-5">
                Copyright 2024 © <a href="/">IntelliKit</a>. All Right Reserved.
            </p>
        </footer>
    );
};