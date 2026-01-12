import { useState, useEffect } from 'react';
import { getEventsByUserId } from '../../scripts/eventStore';
import type { Event } from '../../scripts/eventStore';
import { getCurrentUser } from '../../scripts/userStore';

export default function Upcoming() {
    const [eventData, setEventData] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserEvents = async () => {
            try {
                // Get the current user
                const { user, error: userError } = await getCurrentUser();
                
                if (userError || !user) {
                    setError('User not authenticated');
                    setLoading(false);
                    return;
                }

                // Fetch events for this user
                const { data, error: eventsError } = await getEventsByUserId(user.id);
                
                if (eventsError) {
                    setError(eventsError);
                } else {
                    // Filter events: Upcoming = within 7 days (including today)
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    
                    const sevenDaysFromNow = new Date(today);
                    sevenDaysFromNow.setDate(today.getDate() + 7);
                    
                    const upcomingEvents = (data || []).filter((event) => {
                        const eventDate = new Date(event.event_date);
                        eventDate.setHours(0, 0, 0, 0);
                        return eventDate >= today && eventDate <= sevenDaysFromNow;
                    });
                    
                    // Sort by date and time
                    upcomingEvents.sort((a, b) => {
                        const dateA = new Date(`${a.event_date}T${a.event_time}`);
                        const dateB = new Date(`${b.event_date}T${b.event_time}`);
                        return dateA.getTime() - dateB.getTime();
                    });
                    
                    setEventData(upcomingEvents);
                }
            } catch {
                setError('Failed to fetch events');
            } finally {
                setLoading(false);
            }
        };

        fetchUserEvents();
    }, []);

    if (loading) {
        return (
            <section className="w-full min-h-20">
                <div className="w-full h-full flex justify-center items-center gap-5">
                    <i className='pi pi-spinner spin-animation'></i>
                    <p className='text-slate-500'>Loading events...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="w-full min-h-25 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] border border-secondary-300 p-4 rounded-lg">
                <div className="w-full h-full flex justify-center items-center">
                    <p className="text-red-500">Error: {error}</p>
                </div>
            </section>
        );
    }

    return (
        <>
            {eventData.length === 0 ? (
                <section className="w-full min-h-20">
                    <div className="w-full h-full flex justify-center items-center">
                        <p className='text-slate-500'>No upcoming events</p>
                    </div>
                </section>
            ) : (
                <div className="flex flex-col gap-2">
                    {eventData.map((event) => (
                        <section key={event.id} className="w-full min-h-30 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] border border-secondary-300 p-4 rounded-lg">
                            <div className="w-full h-full flex gap-2">
                                <div className="w-[35%]">
                                    <div className="w-20 h-20 bg-blue-100 rounded-xl flex justify-center items-center text-primary-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10">
                                            <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                                        </svg>
                                    </div>
                                </div>
                                <div>
                                    <h1 className="font-bold text-l text-secondary-600">{event.event_name}</h1>
                                    <p className="text-secondary-500">{new Date(event.event_date).toLocaleDateString()}</p>
                                    <p className="text-secondary-500">{event.event_time}</p>
                                    {event.event_description && (
                                        <p className="text-secondary-500 text-sm">{event.event_description}</p>
                                    )}
                                </div>
                            </div>
                        </section>
                    ))}
                </div>
            )}
        </>
    );
}