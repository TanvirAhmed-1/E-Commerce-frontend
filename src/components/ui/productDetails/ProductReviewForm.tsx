"use client";

import React, { useState } from "react";
import { Star, UploadCloud, X } from "lucide-react";

interface ProductReviewFormProps {
  token?: string | null;
  onReviewSubmit: (rating: number, message: string, images: File[]) => Promise<void>;
  isSubmittingReview?: boolean;
  onLoginRedirect?: () => void;
}

export const ProductReviewForm: React.FC<ProductReviewFormProps> = ({
  token,
  onReviewSubmit,
  isSubmittingReview = false,
  onLoginRedirect,
}) => {
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewMessage, setReviewMessage] = useState("");
  const [localImages, setLocalImages] = useState<File[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArr = Array.from(e.target.files);
      setLocalImages((prev) => [...prev, ...filesArr].slice(0, 5));
    }
  };

  const removeLocalImage = (idx: number) => {
    setLocalImages(localImages.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onReviewSubmit(reviewRating, reviewMessage, localImages);
    setReviewMessage("");
    setLocalImages([]);
    setReviewRating(5);
  };

  return (
    <div className="p-5 bg-[#f2f3ff] dark:bg-[#09090e] border border-slate-200/60 dark:border-slate-800 rounded-xl shadow-xs">
      <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
        Write a Review
      </h4>

      {!token ? (
        <div className="space-y-3 py-2 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Please log in to submit a review for this product.
          </p>
          <button
            type="button"
            onClick={onLoginRedirect}
            className="w-full bg-[#003820] dark:bg-[#0f5132] text-white font-bold h-9 rounded-lg text-xs uppercase tracking-wider cursor-pointer hover:bg-[#0f5132]"
          >
            Log In to Review
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
              Your Rating
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setReviewRating(s)}
                  onMouseEnter={() => setHoverRating(s)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 cursor-pointer"
                >
                  <Star
                    size={18}
                    className={`${
                      s <= (hoverRating || reviewRating)
                        ? "text-amber-500 fill-amber-500"
                        : "text-slate-300 dark:text-slate-700"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
              Review Message
            </label>
            <textarea
              value={reviewMessage}
              onChange={(e) => setReviewMessage(e.target.value)}
              rows={3}
              placeholder="Share your experience..."
              className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121320] focus:outline-none focus:ring-1 focus:ring-[#003820] text-slate-900 dark:text-white"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
              Add Photos (Max 5)
            </label>
            <div className="flex flex-wrap gap-2">
              {localImages.map((f, i) => (
                <div key={i} className="relative w-12 h-12 rounded-lg border overflow-hidden">
                  <img src={URL.createObjectURL(f)} alt="preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeLocalImage(i)}
                    className="absolute top-0.5 right-0.5 p-0.5 bg-black/60 text-white rounded-full cursor-pointer"
                  >
                    <X size={8} />
                  </button>
                </div>
              ))}
              {localImages.length < 5 && (
                <label className="w-12 h-12 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#003820] flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-[#003820]">
                  <UploadCloud size={14} />
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmittingReview}
            className="w-full bg-[#003820] hover:bg-[#0f5132] text-white font-bold h-9 rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isSubmittingReview ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ProductReviewForm;
