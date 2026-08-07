import React, { useState } from "react";
import { Star } from "lucide-react"; 

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary/40 backdrop-blur-sm">
      <div className="bg-neutral-50 rounded-lg shadow-xl border border-tertiary w-full max-w-md p-6 m-4">
        <h2 className="text-2xl font-headline font-bold text-primary mb-2 text-center">Reviews</h2>
        <p className="text-secondary text-sm text-center mb-6">How was your experience with {projectName}?</p>

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
                    ? "fill-primary text-primary" 
                    : "text-tertiary"
                }`}
              />
            </button>
          ))}
        </div>

        {/* Review Textbox */}
        <textarea
          placeholder="reviews"
          className="w-full border border-tertiary rounded-md p-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-2">
          <button
            onClick={() => onSubmit(rating, comment)}
            disabled={rating === 0}
            className="w-full bg-primary hover:bg-secondary disabled:bg-tertiary text-neutral-50 font-bold py-2 px-4 rounded transition-colors"
          >
            Submit Review
          </button>
          <button 
            onClick={onClose}
            className="w-full bg-transparent hover:bg-neutral text-secondary font-semibold text-sm py-1 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;