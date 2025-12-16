import { Input, Label } from "@heroui/react";
import { TextArea } from '@heroui/react';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createEvent } from "../scripts/eventStore";
import { getCurrentUser } from "../scripts/userStore";

export default function Create() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Form state
    const [eventTitle, setEventTitle] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [eventDescription, setEventDescription] = useState('');

    const goToHome = () => {
        navigate('/');
    };

    const handleCreateEvent = async () => {
        // Validate required fields
        if (!eventTitle.trim() || !eventDate || !eventTime) {
            setError('Please fill in all required fields (Title, Date, and Time)');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Get current user
            const { user, error: userError } = await getCurrentUser();
            
            if (userError || !user) {
                setError('You must be logged in to create an event');
                setLoading(false);
                return;
            }

            // Create the event
            const { data, error: createError } = await createEvent({
                event_name: eventTitle.trim(),
                event_date: eventDate,
                event_time: eventTime,
                event_description: eventDescription.trim() || undefined,
                user_id: user.id
            });

            if (createError) {
                setError(createError);
            } else {
                // Success - navigate back to home
                navigate('/');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <main className="h-full w-screen bg-slate-100 flex flex-col">
                <section className="gradient-1 shrink-0 p-4 rounded-b-3xl h-[18%]">
                    <h1 className="text-4xl font-bold text-accent-foreground">Schedify</h1>
                    <h1 className='text-4xl font-bold text-blue-200 ml-4'>//Create</h1>
                </section>
                
                <section className="flex-1 w-full p-4 flex flex-col overflow-y-auto bg-slate-100">
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}
                    
                    <div className="flex flex-col gap-2 mb-8">
                        <Label htmlFor="input-type-title" className="text-secondary-500">Event Title</Label>
                        <Input 
                            id="input-type-title" 
                            type="text" 
                            className="shadow-1 h-15 inputBox border border-slate-300 bg-white" 
                            placeholder="Add an event title"
                            value={eventTitle}
                            onChange={(e) => setEventTitle(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex flex-col gap-2 mb-8">
                        <Label htmlFor="input-type-date" className="text-secondary-500 mb-2">Date</Label>
                        <Input 
                            id="input-type-date" 
                            type="date" 
                            className="shadow-1 h-15 bg-white inputBox border border-slate-300"
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex flex-col gap-2 mb-8">
                        <Label htmlFor="input-type-time" className="text-secondary-500 mb-2">Time</Label>
                        <Input 
                            id="input-type-time" 
                            type="time" 
                            className="shadow-1 h-15 bg-white inputBox border border-slate-300"
                            value={eventTime}
                            onChange={(e) => setEventTime(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex flex-col gap-2 mb-8">
                        <Label htmlFor="input-type-description" className="text-secondary-500 mb-2">Description</Label>
                        <TextArea
                            id="input-type-description"
                            aria-label="Quick project update"
                            className="h-45 w-full inputBox border border-slate-300"
                            placeholder="Write a description"
                            value={eventDescription}
                            onChange={(e) => setEventDescription(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex justify-center gap-2">
                        <button 
                            className="button h-15 w-[50%] bg-white border border-slate-300" 
                            onClick={goToHome}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button 
                            className="button h-15 w-[50%] text-white font-bold gradient-1 border border-slate-600"
                            onClick={handleCreateEvent}
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Event'}
                        </button>
                    </div>
                </section>
            </main>
        </>
    );
}