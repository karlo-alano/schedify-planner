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
    
    // Field-level error state
    const [fieldErrors, setFieldErrors] = useState<{
        title?: string;
        description?: string;
        date?: string;
        time?: string;
    }>({});

    const goToHome = () => {
        navigate('/');
    };

    const handleCreateEvent = async () => {
        // Clear previous errors
        setError(null);
        const newFieldErrors: {
            title?: string;
            description?: string;
            date?: string;
            time?: string;
        } = {};

        // Title validation
        if (!eventTitle.trim()) {
            newFieldErrors.title = 'Title is required.';
        } else if (eventTitle.trim().length < 3) {
            newFieldErrors.title = 'Title must be at least 3 characters.';
        } else if (eventTitle.trim().length > 25) {
            newFieldErrors.title = 'Title cannot exceed 25 characters.';
        }

        // Description validation (optional, max 150 characters)
        if (eventDescription.length > 150) {
            newFieldErrors.description = 'Description cannot exceed 150 characters.';
        }

        // Date validation
        if (!eventDate) {
            newFieldErrors.date = 'Date is required.';
        }

        // Time validation
        if (!eventTime) {
            newFieldErrors.time = 'Time is required.';
        }

        // Set field errors
        setFieldErrors(newFieldErrors);

        // Prevent submission if there are validation errors
        if (Object.keys(newFieldErrors).length > 0) {
            return;
        }

        setLoading(true);

        try {
            // Get current user
            const { user, error: userError } = await getCurrentUser();
            
            if (userError || !user) {
                setError('You must be logged in to create an event');
                setLoading(false);
                return;
            }

            // Create the event
            const { error: createError } = await createEvent({
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
                        <Label htmlFor="input-type-title" className="text-secondary-500">Event Title *</Label>
                        <Input 
                            id="input-type-title" 
                            type="text" 
                            required
                            minLength={3}
                            maxLength={25}
                            className={`shadow-1 h-15 inputBox border ${fieldErrors.title ? 'border-red-400' : 'border-slate-300'} bg-white`}
                            placeholder="Add an event title"
                            value={eventTitle}
                            onChange={(e) => {
                                setEventTitle(e.target.value);
                                // Clear error when user starts typing
                                if (fieldErrors.title) {
                                    setFieldErrors(prev => ({ ...prev, title: undefined }));
                                }
                            }}
                        />
                        {fieldErrors.title && (
                            <small className="text-red-700 text-sm mt-1">{fieldErrors.title}</small>
                        )}
                    </div>
                    
                    <div className="flex flex-col gap-2 mb-8">
                        <Label htmlFor="input-type-date" className="text-secondary-500 mb-2">Date *</Label>
                        <Input 
                            id="input-type-date" 
                            type="date" 
                            required
                            className={`shadow-1 h-15 bg-white inputBox border ${fieldErrors.date ? 'border-red-400' : 'border-slate-300'}`}
                            value={eventDate}
                            onChange={(e) => {
                                setEventDate(e.target.value);
                                // Clear error when user starts typing
                                if (fieldErrors.date) {
                                    setFieldErrors(prev => ({ ...prev, date: undefined }));
                                }
                            }}
                        />
                        {fieldErrors.date && (
                            <small className="text-red-700 text-sm mt-1">{fieldErrors.date}</small>
                        )}
                    </div>
                    
                    <div className="flex flex-col gap-2 mb-8">
                        <Label htmlFor="input-type-time" className="text-secondary-500 mb-2">Time *</Label>
                        <Input 
                            id="input-type-time" 
                            type="time" 
                            required
                            className={`shadow-1 h-15 bg-white inputBox border ${fieldErrors.time ? 'border-red-400' : 'border-slate-300'}`}
                            value={eventTime}
                            onChange={(e) => {
                                setEventTime(e.target.value);
                                // Clear error when user starts typing
                                if (fieldErrors.time) {
                                    setFieldErrors(prev => ({ ...prev, time: undefined }));
                                }
                            }}
                        />
                        {fieldErrors.time && (
                            <small className="text-red-700 text-sm mt-1">{fieldErrors.time}</small>
                        )}
                    </div>
                    
                    <div className="flex flex-col gap-2 mb-8">
                        <Label htmlFor="input-type-description" className="text-secondary-500 mb-2">Description</Label>
                        <TextArea
                            id="input-type-description"
                            aria-label="Quick project update"
                            maxLength={150}
                            className={`h-45 w-full inputBox border ${fieldErrors.description ? 'border-red-400' : 'border-slate-300'}`}
                            placeholder="Write a description"
                            value={eventDescription}
                            onChange={(e) => {
                                setEventDescription(e.target.value);
                                // Clear error when user starts typing
                                if (fieldErrors.description) {
                                    setFieldErrors(prev => ({ ...prev, description: undefined }));
                                }
                            }}
                        />
                        {fieldErrors.description && (
                            <small className="text-red-700 text-sm mt-1">{fieldErrors.description}</small>
                        )}
                        <div className="text-right text-xs text-gray-400">
                            {eventDescription.length} / 150
                        </div>
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