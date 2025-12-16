import { useNavigate } from "react-router-dom"

export default function AddButton() {
    const navigate = useNavigate();
    const goToCreate = () => {
        navigate('/create')
    }

    return(
        <>
            <button className="h-15 w-15 rounded-full bg-primary-500 center-children text-white text-3xl shadow-1 button" onClick={goToCreate}>+</button>
        </>
    )
}