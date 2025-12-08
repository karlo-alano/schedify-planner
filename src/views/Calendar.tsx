import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import AddButton from '../components/Calendar/addButton';


export default function Calendar() {
    return(
        <main className="h-full w-screen bg-slate-100 flex flex-col">
            <section className="gradient-1 shrink-0 p-4 rounded-b-3xl h-[18%]">
                <h1 className="text-4xl font-bold text-accent-foreground">Schedify</h1>
                <h1 className='text-4xl font-bold text-blue-200 ml-4'>//Calendar</h1>

            </section>
            <section className="flex-1 w-full p-4 flex flex-col overflow-y-auto">
                <div className='bg-white rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] border-2 border-secondary-100 overflow-hidden'>
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
                <div>
                    <h1>Events Today</h1>
                </div>

                <section className='absolute right-4 bottom-25'>
                    <AddButton />
                </section>
            </section>
        </main>
    )
}