export default function QuickActions() {
    return(
        <>
           <section className="w-full min-h-25 flex gap-2">
                <div className="w-[50%] h-25">
                    <div className="w-full h-full gradient-1 rounded-2xl font-extrabold text-white center-children flex-col shadow-1 button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10">
                            <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                        </svg>
                        <p className="font-normal">Create Event</p>
                    </div>
                </div>
                <div className="w-[50%] h-25">
                    <div className="w-full h-full bg-blue-100 rounded-2xl font-extrabold text-primary-500 center-children flex-col shadow-1 button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10">
                            <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clipRule="evenodd" />
                        </svg>

                        <p className="font-normal">Calendar</p>
                    </div>
                </div>
           </section>
        </>
        
    )
}