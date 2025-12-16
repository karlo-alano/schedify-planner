import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import AddButton from '../components/Calendar/addButton';


export default function Calendar() {
    return(
        <main className="h-full w-screen bg-slate-100 flex flex-col">
            <section className="gradient-1 shrink-0 p-4 rounded-b-3xl h-[18%]">
                <h1 className="text-4xl font-bold text-accent-foreground animate-enter" style={{ "--delay": "0s" }}>Schedify</h1>
                <h1 className="text-4xl font-bold text-blue-200 ml-4 animate-enter" style={{ "--delay": "0.1s" }}>//Calendar</h1>

            </section>
            <section className="flex-1 w-full p-4 flex flex-col overflow-y-auto">
                <div className="bg-white rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-300 animate-enter" style={{ "--delay": "0.2s" }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar
                            sx={{
                                '& .MuiDateCalendar-root': {
                                    padding: '1rem',
                                    width: '100%'
                                },
                                '& .MuiPickersCalendarHeader-root': {
                                    padding: '0 1rem 1rem 1rem',
                                    marginBottom: 0
                                },
                                '& .MuiDayCalendar-root': {
                                    padding: '0 1rem 1rem 1rem'
                                }
                            }}
                        />
                    </LocalizationProvider>
                </div>
                <div className="animate-enter" style={{ "--delay": "0.1s" }}>
                    <h1 className="font-bold text-2xl text-secondary-500 p-4">Events Today</h1>
                    <div className='card bg-white border border-slate-300'></div>
                </div>

                <section className='absolute right-4 bottom-25'>
                    <AddButton />
                </section>
            </section>
        </main>
    )
}