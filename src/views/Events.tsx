import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEventsByUserId, deleteEvent, type Event } from '../scripts/eventStore';
import { getCurrentUser } from '../scripts/userStore';

export default function Events() {
    const navigate = useNavigate();
    const [eventData, setEventData] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);

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
                    setEventData(data || []);
                }
            } catch (err) {
                console.error(err);
                setError('Failed to fetch events');
            } finally {
                setLoading(false);
            }
        };

        fetchUserEvents();
    }, []);

    const handleEdit = (event: Event) => {
        navigate(`/create`, { state: { editingEvent: event } });
    };

    const handleDelete = async (eventId: string) => {
        setDeleteError(null);
        
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                const { error } = await deleteEvent(eventId);
                
                if (error) {
                    setDeleteError(error);
                } else {
                    setEventData(eventData.filter(event => event.id !== eventId));
                }
            } catch (err) {
                console.error(err);
                setDeleteError('Failed to delete event');
            }
        }
    };

    const truncateDescription = (description: string | undefined, lines: number = 2) => {
        if (!description) return '';
        const textLines = description.split('\n');
        return textLines.slice(0, lines).join('\n');
    };

    return(
        <main className="h-full w-screen bg-slate-100 flex flex-col overflow-hidden">
            <section className="gradient-1 shrink-0 p-4 rounded-b-3xl h-[18%]">
                <h1 className="text-4xl font-bold text-accent-foreground">Schedify</h1>
                <h1 className='text-4xl font-bold text-blue-200 ml-4'>//Events</h1>
            </section>
            <section className="flex-1 min-h-0 w-full overflow-y-scroll">
                <div className="p-4">
                {deleteError && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        Error: {deleteError}
                    </div>
                )}

                {loading ? (
                    <div className="w-full h-full flex justify-center items-center gap-5">
                        <i className='pi pi-spinner spin-animation'></i>
                        <p className='text-slate-500'>Loading events...</p>
                    </div>
                ) : error ? (
                    <div className="w-full flex justify-center items-center">
                        <p className="text-red-500">Error: {error}</p>
                    </div>
                ) : eventData.length === 0 ? (
                    <div className="w-full h-full flex justify-center items-center">
                        <p className='text-slate-500'>No events found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {eventData.map((event) => (
                            <div key={event.id} className="card card-rounded bg-white flex flex-col">
                                <h2 className="text-xl font-bold text-secondary-600 mb-2">{event.event_name}</h2>
                                
                                {event.event_description && (
                                    <p className="text-secondary-500 text-sm mb-3 line-clamp-2">
                                        {truncateDescription(event.event_description)}
                                    </p>
                                )}
                                
                                <div className="flex flex-col gap-1 mb-4 flex-1">
                                    <p className="text-secondary-500 text-sm">
                                        <span className="font-semibold">Date:</span> {new Date(event.event_date).toLocaleDateString()}
                                    </p>
                                    <p className="text-secondary-500 text-sm">
                                        <span className="font-semibold">Time:</span> {event.event_time}
                                    </p>
                                </div>
                                
                                <div className="flex gap-2 mt-auto">
                                    <button
                                        onClick={() => handleEdit(event)}
                                        className="flex-1 px-3 py-2 bg-white border border-primary-500 rounded-lg font-semibold text-sm text-primary-500 hover:bg-primary-500 hover:border-primary-500 hover:text-white transition-colors duration-200 flex items-center justify-center"
                                    >
                                        <i className="pi pi-pencil"></i>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(event.id)}
                                        className="flex-1 px-3 py-2 bg-white border border-red-500 rounded-lg font-semibold text-sm text-red-500 hover:bg-red-500 hover:border-red-500 hover:text-white transition-colors duration-200 flex items-center justify-center"
                                    >
                                        <i className="pi pi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                </div>
            </section>
        </main>
    )
}