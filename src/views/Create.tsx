import { Input, Label } from "@heroui/react";
import { TextArea } from '@heroui/react';
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { createEvent, updateEvent, uploadEventImage, type Event } from "../scripts/eventStore";
import { getCurrentUser } from "../scripts/userStore";

// --- Updated Types for Daily Forecast ---
type DayCondition = {
    text: string;
    icon: string;
};

type DayValues = {
    maxtemp_c: number;
    mintemp_c: number;
    condition: DayCondition;
};

type ForecastDay = {
    date: string;
    day: DayValues;
};

export default function Create() {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Form state
    const [eventTitle, setEventTitle] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [fieldErrors, setFieldErrors] = useState<{
        title?: string;
        description?: string;
        date?: string;
        time?: string;
        image?: string;
    }>({});

    // Image state
    const [eventImage, setEventImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageUploading, setImageUploading] = useState(false);

    // Weather State
    const [weatherLocation, setWeatherLocation] = useState('Manila');
    const [weatherLoading, setWeatherLoading] = useState(false);
    const [weatherError, setWeatherError] = useState<string | null>(null);
    // Changed from hourly array to daily array
    const [weatherDays, setWeatherDays] = useState<ForecastDay[]>([]);

    // Load editing event from location state if provided
    useEffect(() => {
        const state = location.state as { editingEvent?: Event } | undefined;
        if (state?.editingEvent) {
            const event = state.editingEvent;
            setEditingEvent(event);
            setEventTitle(event.event_name);
            setEventDate(event.event_date);
            setEventTime(event.event_time);
            setEventDescription(event.event_description || '');
            if (event.event_picture) {
                setImagePreview(event.event_picture);
            }
        }
    }, [location.state]);

    // Fetch weather forecast (Next 7 Days)
    useEffect(() => {
        const fetchWeather = async () => {
            const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

            if (!apiKey) {
                setWeatherError('Add VITE_WEATHER_API_KEY to your .env file to view weather.');
                setWeatherDays([]);
                setWeatherLoading(false);
                return;
            }

            if (!weatherLocation.trim()) {
                setWeatherError('Please provide a location to see weather.');
                setWeatherDays([]);
                setWeatherLoading(false);
                return;
            }

            setWeatherLoading(true);
            setWeatherError(null);

            try {
                // Changed days=2 to days=7 to get a week's forecast
                const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(weatherLocation)}&days=7&aqi=no&alerts=no`;

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Weather service unavailable');
                }

                const data = await response.json();
                // Extract the list of forecast days
                const forecastDays = data?.forecast?.forecastday as ForecastDay[] || [];
                
                setWeatherDays(forecastDays);
            } catch {
                setWeatherError('Unable to load weather right now.');
                setWeatherDays([]);
            } finally {
                setWeatherLoading(false);
            }
        };

        // Debounce slightly or just run on location change. 
        // Removed eventDate dependency since we are fetching a standard 7-day outlook now.
        const timer = setTimeout(() => {
            fetchWeather();
        }, 500);

        return () => clearTimeout(timer);
    }, [weatherLocation]);

    const goToHome = () => {
        navigate('/');
    };

    // Check if event date is in the past
    const isEventDateInPast = () => {
        if (!eventDate) return false;
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
        return eventDate < today;
    };

    // Handle image file selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setFieldErrors(prev => ({ ...prev, image: 'Please select a valid image file' }));
                return;
            }

            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                setFieldErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
                return;
            }

            setEventImage(file);
            setFieldErrors(prev => ({ ...prev, image: undefined }));

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCreateEvent = async () => {
        // Clear previous errors
        setError(null);
        const newFieldErrors: {
            title?: string;
            description?: string;
            date?: string;
            time?: string;
            image?: string;
        } = {};

        // Title validation
        if (!eventTitle.trim()) {
            newFieldErrors.title = 'Title is required.';
        } else if (eventTitle.trim().length < 3) {
            newFieldErrors.title = 'Title must be at least 3 characters.';
        } else if (eventTitle.trim().length > 25) {
            newFieldErrors.title = 'Title cannot exceed 25 characters.';
        }

        // Description validation
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
            let imageUrl: string | undefined;

            // Upload image if one is selected and event date is in the past
            if (eventImage && isEventDateInPast()) {
                setImageUploading(true);
                // For new events, we'll need to create a temporary ID
                // For updates, we can use the existing event ID
                const tempEventId = editingEvent ? editingEvent.id : `temp_${Date.now()}`;

                const { url, error: uploadError } = await uploadEventImage(eventImage, tempEventId);

                if (uploadError) {
                    setError(`Image upload failed: ${uploadError}`);
                    setLoading(false);
                    setImageUploading(false);
                    return;
                }

                imageUrl = url || undefined;
                setImageUploading(false);
            }

            if (editingEvent) {
                // Update existing event
                const updateData: any = {
                    event_name: eventTitle.trim(),
                    event_date: eventDate,
                    event_time: eventTime,
                    event_description: eventDescription.trim() || undefined,
                };

                if (imageUrl !== undefined) {
                    updateData.event_picture = imageUrl;
                }

                const { error: updateError } = await updateEvent(editingEvent.id, updateData);

                if (updateError) {
                    setError(updateError);
                } else {
                    navigate('/events');
                }
            } else {
                // Create new event
                const { user, error: userError } = await getCurrentUser();

                if (userError || !user) {
                    setError('You must be logged in to create an event');
                    setLoading(false);
                    return;
                }

                const createData: any = {
                    event_name: eventTitle.trim(),
                    event_date: eventDate,
                    event_time: eventTime,
                    event_description: eventDescription.trim() || undefined,
                    user_id: user.id
                };

                if (imageUrl !== undefined) {
                    createData.event_picture = imageUrl;
                }

                const { error: createError } = await createEvent(createData);

                if (createError) {
                    setError(createError);
                } else {
                    navigate('/');
                }
            }
        } catch {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
            setImageUploading(false);
        }
    };

    // Helper to format date string (YYYY-MM-DD) to short day/month (e.g., "Mon, Oct 12")
    const formatDateDisplay = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    return (
        <>
            <main className="h-full w-screen bg-slate-100 flex flex-col animate-enter" style={{ "--delay": "0s" } as React.CSSProperties}>
                <section className="gradient-1 shrink-0 p-4 rounded-b-3xl h-[18%]">
                    <h1 className="text-4xl font-bold text-accent-foreground">Schedify</h1>
                    <h1 className='text-4xl font-bold text-blue-200 ml-4'>//{editingEvent ? 'Edit' : 'Create'}</h1>
                </section>
                
                <section className="flex-1 w-full p-4 flex flex-col overflow-y-auto bg-slate-100">
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    {/* Cover Photo Display */}
                    {imagePreview && (
                        <div className="mb-8">
                            <div className="w-full h-48 rounded-xl overflow-hidden shadow-lg border border-slate-200">
                                <img
                                    src={imagePreview}
                                    alt="Event cover"
                                    className="w-full h-full object-cover"
                                />
                            </div>
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

                    {/* Image Upload - Only show for past events */}
                    {isEventDateInPast() && (
                        <div className="flex flex-col gap-2 mb-8">
                            <Label htmlFor="input-type-image" className="text-secondary-500 mb-2">Event Picture</Label>
                            <div className="flex flex-col gap-3">
                                <Input
                                    id="input-type-image"
                                    type="file"
                                    accept="image/*"
                                    className={`shadow-1 h-15 bg-white inputBox border ${fieldErrors.image ? 'border-red-400' : 'border-slate-300'}`}
                                    onChange={handleImageChange}
                                    disabled={imageUploading}
                                />
                                {fieldErrors.image && (
                                    <small className="text-red-700 text-sm mt-1">{fieldErrors.image}</small>
                                )}

                                {/* Image Preview */}
                                {imagePreview && (
                                    <div className="flex flex-col gap-2">
                                        <p className="text-sm text-secondary-500">Preview:</p>
                                        <div className="relative inline-block">
                                            <img
                                                src={imagePreview}
                                                alt="Event preview"
                                                className="w-32 h-32 object-cover rounded-lg border border-slate-300"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEventImage(null);
                                                    setImagePreview(null);
                                                }}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {imageUploading && (
                                    <div className="flex items-center gap-2 text-secondary-500 text-sm">
                                        <i className='pi pi-spinner spin-animation'></i>
                                        <span>Uploading image...</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-3 mb-8">
                        <div className="flex items-center justify-between">
                            <Label className="text-secondary-500">7-Day Forecast</Label>
                            <Input
                                aria-label="Weather location"
                                className="shadow-1 h-12 w-44 inputBox border border-slate-300 bg-white"
                                placeholder="City or ZIP"
                                value={weatherLocation}
                                onChange={(e) => setWeatherLocation(e.target.value)}
                            />
                        </div>

                        <div className="card-rounded bg-white">
                            {weatherError ? (
                                <p className="text-sm text-red-500">{weatherError}</p>
                            ) : weatherLoading ? (
                                <div className="flex items-center gap-2 text-secondary-500 text-sm">
                                    <i className='pi pi-spinner spin-animation'></i>
                                    <span>Loading forecast…</span>
                                </div>
                            ) : weatherDays.length === 0 ? (
                                <p className="text-sm text-secondary-500">No forecast available.</p>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {weatherDays.map((forecast) => (
                                        <div key={forecast.date} className="border border-slate-200 rounded-lg p-3 bg-white flex flex-col items-center text-center">
                                            <span className="text-xs font-bold text-secondary-600 mb-1">
                                                {formatDateDisplay(forecast.date)}
                                            </span>
                                            <img 
                                                src={forecast.day.condition.icon} 
                                                alt={forecast.day.condition.text} 
                                                className="w-10 h-10 my-1" 
                                            />
                                            <p className="text-xs text-secondary-500 line-clamp-1" title={forecast.day.condition.text}>
                                                {forecast.day.condition.text}
                                            </p>
                                            <div className="flex gap-2 mt-1 text-sm">
                                                <span className="font-bold text-slate-700">{Math.round(forecast.day.maxtemp_c)}°</span>
                                                <span className="text-slate-400">{Math.round(forecast.day.mintemp_c)}°</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
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
                            {loading ? (editingEvent ? 'Updating...' : 'Creating...') : (editingEvent ? 'Update Event' : 'Create Event')}
                        </button>
                    </div>
                </section>
            </main>
        </>
    );
}