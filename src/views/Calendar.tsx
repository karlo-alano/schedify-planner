import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';


export default function Calendar() {
    return(
        <main className="h-full w-screen bg-slate-100 flex flex-col">
            <section className="gradient-1 h-[25%] p-4 rounded-b-3xl">
                <h1 className="text-4xl font-bold text-accent-foreground">Schedify</h1>

            </section>
            <section className="min-h-[75%] w-full p-4 flex flex-col overflow-y-scroll flex-1">
                <div className='card bg-white'>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar />
                    </LocalizationProvider>
                </div>
            </section>
        </main>
    )
}