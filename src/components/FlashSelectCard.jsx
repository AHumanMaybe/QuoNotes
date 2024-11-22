import { useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/authContext";

function FlashSelectCard({ index, input }) {
    const navigate = useNavigate();
    const { currentUser, userLoggedIn } = useAuth();

    const handleClick = () => {
        if (input === '+') {
        navigate('/create');
        } else {
        navigate(`/flashcards/${ currentUser.uid }/${input}`);
        }
    }

    return (
        <button
        className="flex w-1/4 p-4 text-sm overflow-x-scroll hover:scale-110 h-80 rounded-xl bg-bgd justify-center items-center text-bgl md:text-3xl shadow-md hover:shadow-xl"
        onClick={handleClick}>
            {input}
      </button>
    );


}

export default FlashSelectCard;