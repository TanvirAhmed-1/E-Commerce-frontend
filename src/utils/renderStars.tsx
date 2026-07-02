import React from "react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

export const renderStars = (rating: number) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<FaStar key={i} className="text-yellow-400 dark:text-[#00e5a3] transition-colors" />);
    } else if (i === fullStars + 1 && hasHalf) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 dark:text-[#00e5a3] transition-colors" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-gray-300 dark:text-slate-700/80 transition-colors" />);
    }
  }

  return <div className="flex items-center gap-0.5">{stars}</div>;
};
