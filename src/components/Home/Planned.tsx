export default function Planned() {
    return(
        <>
            <section className="w-full min-h-25 card">
                <div className="w-full h-full flex gap-2">
                    <div className="w-[35%]">
                        <div className="w-20 h-20 bg-blue-100 rounded-xl flex justify-center items-center text-primary-400">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10">
                                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                            </svg>

                        </div>
                        
                    </div>
                    <div >
                        <h1 className="font-bold text-l text-secondary-600">Tagaytay Date</h1>
                        <p className="text-secondary-500">Jan 15, 2026</p>
                        <p className="text-secondary-500">9:00 AM</p> 
                    </div>
                </div>
                
            </section>
        </>
    )
}