import Search from "../components/Home/Search"
import QuickActions from "../components/Home/QuickActions"
import Upcoming from "../components/Home/Upcoming"
import Planned from "../components/Home/Planned"

export default function Home() {
    return(
        <main className="h-full w-screen bg-slate-100" >
            <section className="gradient-1 h-[20%] p-4 rounded-b-3xl ">
                <h1 className="text-4xl font-bold text-accent-foreground animate-enter" style={{ "--delay": "0s" } as React.CSSProperties}>Schedify</h1>
                <Search />
            </section>
            <section className="h-[80%] w-full p-4 flex flex-col overflow-y-scroll animate-enter" style={{ "--delay": "0.2s" } as React.CSSProperties}>
                <div className="bg-white card min-h-40 rounded-t-2xl rounded-b-none border-b-0 flex flex-col">
                    <h1 className="text-xl font-bold text-secondary-600 mb-2">Upcoming</h1>
                    <div className="flex-1 overflow-y-auto">
                        <Upcoming />
                    </div>
                </div>
                <div className='bg-white card min-h-40 rounded-none border-b-0 border-t-0 flex flex-col'>
                    <h1 className="text-xl font-bold text-secondary-600 mb-2">Planning</h1>
                    <div className="flex-1 overflow-y-auto">
                        <Planned />
                    </div>
                </div>
                <div className='bg-white card min-h-40 rounded-b-2xl rounded-t-none border-t-0'>
                    <h1 className="text-xl font-bold text-secondary-600">Quick Actions</h1>
                    <QuickActions />
                </div>


            </section>
        </main>

    )
}
