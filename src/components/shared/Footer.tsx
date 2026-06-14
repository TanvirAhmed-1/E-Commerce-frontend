import React from "react";
import { FaHeadphones, FaShippingFast, FaStore } from "react-icons/fa";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaPinterestP,
  FaTiktok,
} from "react-icons/fa";
import Link from "next/link";

const deliveryServices = [
  {
    icon: <FaStore />,
    title: "Free In-Store Pickup",
    description: "Shop online, pick up in-store — anytime.",
  },
  {
    icon: <FaShippingFast />,
    title: "Fast & Free Shipping",
    description: "Get your order delivered quickly & safely.",
  },
  {
    icon: <FaMoneyBillTransfer />,
    title: "Flexible Payments",
    description: "Multiple secure payment options available.",
  },
  {
    icon: <FaHeadphones />,
    title: "24/7 Customer Support",
    description: "We’re here to help you anytime, anywhere.",
  },
];

const footerLinks = [
  {
    title: "Company",
    links: [
      { name: "About Dekora", href: "/about" },
      { name: "Our Story", href: "/story" },
      { name: "Careers", href: "/careers" },
      { name: "Sustainability", href: "/sustainability" },
      { name: "Press & Media", href: "/press" },
      { name: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Customer Care",
    links: [
      { name: "Help Center", href: "/help" },
      { name: "Shipping & Delivery", href: "/shipping" },
      { name: "Returns & Exchanges", href: "/returns" },
      { name: "Track Your Order", href: "/track-order" },
      { name: "Payment Methods", href: "/payments" },
      { name: "Size Guide", href: "/size-guide" },
    ],
  },
  {
    title: "Shop",
    links: [
      { name: "Men’s Collection", href: "/shop/men" },
      { name: "Women’s Collection", href: "/shop/women" },
      { name: "New Arrivals", href: "/shop/new" },
      { name: "Accessories", href: "/shop/accessories" },
      { name: "Gift Cards", href: "/gift-cards" },
      { name: "Sale", href: "/shop/sale" },
    ],
  },
  {
    title: "Information",
    links: [
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Terms & Conditions", href: "/terms" },
      { name: "Cookies Policy", href: "/cookies" },
      { name: "Store Locator", href: "/stores" },
      { name: "Affiliate Program", href: "/affiliate" },
      { name: "Partnerships", href: "/partnerships" },
    ],
  },
];

const socialLinks = [
  { icon: <FaInstagram />, href: "https://instagram.com" },
  { icon: <FaFacebookF />, href: "https://facebook.com" },
  { icon: <FaTwitter />, href: "https://twitter.com" },
  { icon: <FaPinterestP />, href: "https://pinterest.com" },
  { icon: <FaTiktok />, href: "https://tiktok.com" },
];

function Footer() {
  const date = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 border-t border-gray-200">


      {/* Footer Links */}
      <div className="px-4 container lg:max-w-[1400px] mx-auto border-y border-y-gray-300 py-10 grid grid-cols-1 md:grid-cols-4 gap-10 text-center md:text-left">
        {footerLinks.map((section, i) => (
          <div key={i} className="flex flex-col items-center">
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-800">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <Link
                      href={link.href}
                      className="text-gray-600 hover:text-blue-500 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Follow Us Section */}
      <div className="py-6 text-center">
        <h4 className="text-lg font-semibold mb-3 text-gray-800">Follow Us</h4>
        <div className="flex justify-center gap-6 text-gray-600">
          {socialLinks.map((social, i) => (
            <Link
              key={i}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl hover:text-blue-500 transition-colors"
            >
              {social.icon}
            </Link>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div className="flex justify-between px-4 container lg:max-w-[1400px] mx-auto">
        <p className="text-xs text-gray-500 mb-4">
          White Label Sportswear &copy; {date} | All rights reserved
        </p>
        <a
          target="_blank"
          href="https://www.smartsoftware.com.bd"
          className="text-xs text-gray-500 mb-4 hover:text-blue-500 duration-300 ease-in-out transition-colors"
        >
          E-commerce website Development in BD
        </a>
      </div>
    </footer>
  );
}

export default Footer;
