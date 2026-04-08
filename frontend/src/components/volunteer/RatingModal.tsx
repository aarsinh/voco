import React, { useState } from "react";
import { Star } from "lucide-react"; // Optional: Install lucide-react or use SVG

interface RatingModalProps {
  projectName: string;
  onSubmit: (rating: number, comment: string) => void;
  onClose: () => void;
}

const RatingModal: React.FC<RatingModalProps> = ({ projectName, onSubmit, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 m-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Reviews</h2>
        <p className="text-gray-500 text-sm text-center mb-6">How was your experience with {projectName}?</p>

        {/* Star Rating Logic */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="transition-transform hover:scale-110 focus:outline-none"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            >
              <Star
                size={32}
                className={`transition-colors ${
                  star <= (hover || rating) 
                    ? "fill-yellow-400 text-yellow-400" 
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Review Textbox */}
        <textarea
          placeholder="reviews"
          className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={() => onSubmit(rating, comment)}
            disabled={rating === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Submit Review
          </button>
          <button 
            onClick={onClose}
            className="w-full bg-transparent hover:bg-gray-100 text-gray-500 text-sm py-1 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;