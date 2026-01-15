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

    // State to track which event is currently being considered for deletion
    // If this is not null, the modal shows up
    const [eventToDelete, setEventToDelete] = useState<string | null>(null);

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

    // 1. Trigger the modal by setting the ID
    const handleDeleteClick = (eventId: string) => {
        setDeleteError(null);
        setEventToDelete(eventId);
    };

    // 2. Perform the actual deletion
    const confirmDelete = async () => {
        if (!eventToDelete) return;

        try {
            const { error } = await deleteEvent(eventToDelete);
            
            if (error) {
                setDeleteError(error);
            } else {
                // Update UI immediately on success
                setEventData(eventData.filter(event => event.id !== eventToDelete));
            }
        } catch (err) {
            console.error(err);
            setDeleteError('Failed to delete event');
        } finally {
            // Close the modal
            setEventToDelete(null);
        }
    };

    const truncateDescription = (description: string | undefined, lines: number = 2) => {
        if (!description) return '';
        const textLines = description.split('\n');
        return textLines.slice(0, lines).join('\n');
    };

    // Helper function to check if event is in the past
    const isEventInPast = (eventDate: string) => {
        const today = new Date().toISOString().split('T')[0];
        return eventDate < today;
    };

    // Separate events into past and upcoming
    const pastEvents = eventData.filter(event => isEventInPast(event.event_date));
    const upcomingEvents = eventData.filter(event => !isEventInPast(event.event_date));

    return(
        <main className="h-full w-screen bg-slate-100 flex flex-col overflow-hidden animate-enter" style={{ "--delay": "0s" } as React.CSSProperties}>
            <section className="gradient-1 shrink-0 p-4 rounded-b-3xl h-[18%]">
                <h1 className="text-4xl font-bold text-accent-foreground">Schedify</h1>
                <h1 className='text-4xl font-bold text-blue-200 ml-4'>//Events</h1>
            </section>
            <section className="flex-1 min-h-0 w-full overflow-y-scroll relative">
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
                        <div className="space-y-8">
                            {/* Past Events Section */}
                            {pastEvents.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-bold text-secondary-600 mb-4">Past Events</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {pastEvents.map((event) => (
                                            <div key={event.id} className="card card-rounded bg-white overflow-hidden">
                                                {/* Cover Photo */}
                                                {event.event_picture && (
                                                    <div className="w-full h-32 overflow-hidden">
                                                        <img
                                                            src={event.event_picture}
                                                            alt={event.event_name}
                                                            className="w-full h-full object-cover rounded-3xl"
                                                        />
                                                    </div>
                                                )}

                                                <div className="p-4">
                                                    <h3 className="text-lg font-bold text-secondary-600 mb-2">{event.event_name}</h3>

                                                    {event.event_description && (
                                                        <p className="text-secondary-500 text-sm mb-3 line-clamp-2">
                                                            {truncateDescription(event.event_description)}
                                                        </p>
                                                    )}

                                                    <p className="text-secondary-500 text-sm">
                                                        <span className="font-semibold">Date:</span> {new Date(event.event_date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Upcoming Events Section */}
                            {upcomingEvents.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-bold text-secondary-600 mb-4">
                                        {pastEvents.length > 0 ? 'Upcoming Events' : 'Events'}
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {upcomingEvents.map((event) => (
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
                                                        onClick={() => handleDeleteClick(event.id)}
                                                        className="flex-1 px-3 py-2 bg-white border border-red-500 rounded-lg font-semibold text-sm text-red-500 hover:bg-red-500 hover:border-red-500 hover:text-white transition-colors duration-200 flex items-center justify-center"
                                                    >
                                                        <i className="pi pi-trash"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Delete Confirmation Modal */}
                {eventToDelete && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-xs shadow-2xl transform transition-all scale-100">
                            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto">
                                <i className="pi pi-exclamation-triangle text-red-500 text-xl"></i>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">Delete Event?</h3>
                            <p className="text-gray-600 mb-6 text-center text-sm">
                                This action cannot be undone. Are you sure you want to delete this event?
                            </p>
                            
                            <div className="flex gap-3">
                                <button 
                                    className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
                                    onClick={() => setEventToDelete(null)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl shadow-lg shadow-red-500/30 transition-colors"
                                    onClick={confirmDelete}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
}