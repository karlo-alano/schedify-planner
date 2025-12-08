import { useNavigate } from "react-router-dom"
export default function Hero() {
    const navigate = useNavigate();

    const goToSignUp = () => {
        navigate('/signup')
    }

    return(
        <>
            <section className="h-screen w-screen gradient-1 flex justify-between p-4">
                <div className="flex flex-col center-children">
                    <div className="card bg-white text-primary-500">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-15">
                            <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h1 className="text-white text-6xl font-extrabold">Schedify</h1>
                    <p className="text-white italic text-center px-10 mt-5">
                        Plan, organize, and celebrate your events effortlessly
                    </p>
                    <button className="w-[70%] h-15 mt-10 card button bg-white text-primary-600 text-xl font-bold"
                    onClick={goToSignUp}>
                        Get Started
                    </button>
                </div>
            </section>
        </>
    )
}