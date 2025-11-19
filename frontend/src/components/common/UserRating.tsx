import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../redux/hooks";
import { getAxiosErrorMessage } from "../../utils/handleAxiosError";
import { addRating } from "../../redux/slices/user/userRatingSlice";

const UserRating = () => {
  const dispatch = useAppDispatch();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
try {
    if (rating === 0) {
      toast.error("Please select a rating before submitting.");
      return;
    }
    console.log("Submitted Rating:", rating, "Comment:", comment);

    const res = await dispatch(addRating({rating, comment})).unwrap();
    toast.success(res?.message);
   setSubmitted(true);
} catch (error) {
    console.error("Error submitting rating:", error);
    toast.error(getAxiosErrorMessage(error));
  }

  };

  return (
    <div className="bg-green-50 py-8">
      <div className="container mx-auto px-4 text-center max-w-md">
        <h3 className="text-lg font-bold mb-4 text-green-700">
          Rate Your Experience
        </h3>

        {/* ⭐ Star Rating */}
        <div className="flex justify-center space-x-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={`cursor-pointer text-3xl transition-colors duration-200 ${
                star <= (hover || rating) ? "text-yellow-400" : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            />
          ))}
        </div>

        {/* ✍ Comment Box + Submit */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-3">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Leave a comment..."
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
              rows={3}
            />

            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Submit
            </button>
          </form>
        ) : (
          <div className="mt-4 text-green-700 font-medium">
            🎉 Thanks for your feedback! <br />
            You rated us {rating} ⭐ <br />
            {comment && <p className="italic mt-2">“{comment}”</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRating;
