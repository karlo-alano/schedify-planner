import Search from "../components/Home/Search"
import QuickActions from "../components/Home/QuickActions"
import Upcoming from "../components/Home/Upcoming"
import Planned from "../components/Home/Planned"

export default function Home() {
    return(
        <main className="h-full w-screen bg-slate-100">
            <section className="gradient-1 h-[20%] p-4 rounded-b-3xl">
                <h1 className="text-4xl font-bold text-accent-foreground">Schedify</h1>
                <Search />
            </section>
            <section className="h-[80%] w-full p-4 flex flex-col  overflow-y-scroll">
                <div className='bg-white card min-h-40 rounded-t-2xl rounded-b-none'>
                    <h1 className="text-xl font-bold text-secondary-600 border">Upcoming</h1>
                    <Upcoming />
                </div>
                <div className='bg-white card min-h-40 rounded-none'>
                    <h1 className="text-xl font-bold text-secondary-600 border">Planning</h1>
                    <Planned />
                </div>
                <div className='bg-white card min-h-40 rounded-b-2xl rounded-t-none'>
                    <h1 className="text-xl font-bold text-secondary-600 border">Quick Actions</h1>
                    <QuickActions />
                </div>


            </section>
        </main>

    )
}
