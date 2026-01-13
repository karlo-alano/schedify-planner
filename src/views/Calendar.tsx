import { useEffect, useMemo, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay, type PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import AddButton from '../components/Calendar/addButton';
import { getCurrentUser } from '../scripts/userStore';
import { getEventsByUserId, type Event } from '../scripts/eventStore';


export default function Calendar() {
    const [allEvents, setAllEvents] = useState<Event[]>([]);
    const [eventDates, setEventDates] = useState<string[]>([]);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const { user, error: userError } = await getCurrentUser();
                if (userError || !user) {
                    setFetchError('Unable to load events');
                    return;
                }

                const { data, error } = await getEventsByUserId(user.id);
                if (error) {
                    setFetchError(error);
                    return;
                }

                setAllEvents(data || []);
                const dates = (data || []).map((e) => e.event_date);
                setEventDates(dates);
            } catch (err) {
                setFetchError('Failed to load events');
            }
        };

        loadEvents();
    }, []);

    const eventDateSet = useMemo(() => new Set(eventDates), [eventDates]);

    const selectedDateEvents = useMemo(() => {
        const dateStr = selectedDate.format('YYYY-MM-DD');
        return allEvents.filter(event => event.event_date === dateStr);
    }, [allEvents, selectedDate]);

    const DayWithIndicator = (props: PickersDayProps) => {
        const hasEvent = eventDateSet.has(dayjs(props.day).format('YYYY-MM-DD'));

        return (
            <PickersDay
                {...props}
                sx={hasEvent ? {
                    position: 'relative',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 6,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: '#3b82f6'
                    }
                } : undefined}
            />
        );
    };
    return(
        <main className="h-full w-screen bg-slate-100 flex flex-col">
            <section className="gradient-1 shrink-0 p-4 rounded-b-3xl h-[18%]">
                <h1 className="text-4xl font-bold text-accent-foreground animate-enter" style={{ ['--delay' as any]: "0s" }}>Schedify</h1>
                <h1 className="text-4xl font-bold text-blue-200 ml-4 animate-enter" style={{ ['--delay' as any]: "0.1s" }}>//Calendar</h1>

            </section>
            <section className="flex-1 w-full p-4 flex flex-col overflow-y-auto">
                <div className="bg-white rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-300 animate-enter" style={{ ['--delay' as any]: "0.2s" }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateCalendar
                            value={selectedDate}
                            onChange={(newDate) => newDate && setSelectedDate(newDate)}
                            slots={{
                                day: DayWithIndicator
                            }}
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
                {fetchError && (
                    <p className="text-sm text-red-500 mt-2">{fetchError}</p>
                )}
                <div className="animate-enter mt-4" style={{ ['--delay' as any]: "0.1s" }}>
                    <h1 className="font-bold text-2xl text-secondary-500 px-4 py-2">
                        Events on {selectedDate.format('MMMM D, YYYY')}
                    </h1>
                    <div className='card bg-white border border-slate-300 min-h-32'>
                        {selectedDateEvents.length === 0 ? (
                            <p className="text-secondary-500 text-center py-8">No events on this day</p>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {selectedDateEvents.map((event) => (
                                    <div key={event.id} className="border-b border-slate-200 last:border-0 pb-3 last:pb-0">
                                        <h3 className="font-bold text-lg text-secondary-600">{event.event_name}</h3>
                                        <p className="text-sm text-secondary-500">{event.event_time}</p>
                                        {event.event_description && (
                                            <p className="text-sm text-secondary-500 mt-1">{event.event_description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <section className='absolute right-4 bottom-25'>
                    <AddButton />
                </section>
            </section>
        </main>
    )
}