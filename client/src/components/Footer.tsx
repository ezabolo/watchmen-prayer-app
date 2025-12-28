import { Link } from "wouter";
import { 
  FacebookIcon, 
  InstagramIcon, 
  TwitterIcon, 
  YoutubeIcon 
} from "lucide-react";

export default function Footer() {
  const footerLinks = [
    { name: "About", href: "#" },
    { name: "Watchman Program", href: "/watchman" },
    { name: "Partner With Us", href: "/partner" },
    { name: "Prayer Requests", href: "/prayer-request" },
    { name: "Training", href: "/training" },
    { name: "Contact", href: "#" },
  ];
  
  const socialLinks = [
    { name: "Facebook", icon: FacebookIcon, href: "#" },
    { name: "Instagram", icon: InstagramIcon, href: "#" },
    { name: "Twitter", icon: TwitterIcon, href: "#" },
    { name: "YouTube", icon: YoutubeIcon, href: "#" },
  ];
  
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
          {footerLinks.map((link) => (
            <div key={link.name} className="px-5 py-2">
              <Link to={link.href} className="text-base text-gray-300 hover:text-white">
                {link.name}
              </Link>
            </div>
          ))}
        </nav>
        
        <div className="mt-8 flex justify-center space-x-6">
          {socialLinks.map((social) => (
            <a 
              key={social.name}
              href={social.href}
              className="text-gray-400 hover:text-gray-300"
            >
              <span className="sr-only">{social.name}</span>
              <social.icon className="h-6 w-6" aria-hidden="true" />
            </a>
          ))}
        </div>
        
        <p className="mt-8 text-center text-base text-gray-400">
          &copy; {new Date().getFullYear()} Prayer Watchman. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
