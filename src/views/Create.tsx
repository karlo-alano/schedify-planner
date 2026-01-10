import { Input, Label } from "@heroui/react";
import { TextArea } from '@heroui/react';
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { createEvent, updateEvent, type Event } from "../scripts/eventStore";
import { getCurrentUser } from "../scripts/userStore";

type HourForecast = {
    time: string;
    temp_c: number;
    condition: { text: string; icon: string };
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

    // Weather
    const [weatherLocation, setWeatherLocation] = useState('Manila');
    const [weatherLoading, setWeatherLoading] = useState(false);
    const [weatherError, setWeatherError] = useState<string | null>(null);
    const [weatherHours, setWeatherHours] = useState<HourForecast[]>([]);

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
        }
    }, [location.state]);

    // Fetch weather forecast (next 14 hours) whenever location or date changes
    useEffect(() => {
        const fetchWeather = async () => {
            const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

            if (!apiKey) {
                setWeatherError('Add VITE_WEATHER_API_KEY to your .env file to view weather.');
                setWeatherHours([]);
                setWeatherLoading(false);
                return;
            }

            if (!weatherLocation.trim()) {
                setWeatherError('Please provide a location to see weather.');
                setWeatherHours([]);
                setWeatherLoading(false);
                return;
            }

            setWeatherLoading(true);
            setWeatherError(null);

            try {
                const targetDate = eventDate || new Date().toISOString().split('T')[0];
                const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${encodeURIComponent(weatherLocation)}&days=2&aqi=no&alerts=no`;

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Weather service unavailable');
                }

                const data = await response.json();
                const forecastDays = data?.forecast?.forecastday as any[] | undefined;
                const matchedDay = forecastDays?.find((d) => d?.date === targetDate) || forecastDays?.[0];
                const hours: HourForecast[] = matchedDay?.hour || [];

                setWeatherHours(hours.slice(0, 14));
            } catch (err) {
                setWeatherError('Unable to load weather right now.');
                setWeatherHours([]);
            } finally {
                setWeatherLoading(false);
            }
        };

        fetchWeather();
    }, [weatherLocation, eventDate]);

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
            if (editingEvent) {
                // Update existing event
                const { error: updateError } = await updateEvent(editingEvent.id, {
                    event_name: eventTitle.trim(),
                    event_date: eventDate,
                    event_time: eventTime,
                    event_description: eventDescription.trim() || undefined,
                });

                if (updateError) {
                    setError(updateError);
                } else {
                    // Success - navigate back to events
                    navigate('/events');
                }
            } else {
                // Create new event
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
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const formatHour = (time: string) => {
        const parsed = new Date(time.replace(' ', 'T'));
        return parsed.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    };

    return (
        <>
            <main className="h-full w-screen bg-slate-100 flex flex-col">
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

                    <div className="flex flex-col gap-3 mb-8">
                        <div className="flex items-center justify-between">
                            <Label className="text-secondary-500">Weather (next 14 hours)</Label>
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
                                    <span>Loading weather…</span>
                                </div>
                            ) : weatherHours.length === 0 ? (
                                <p className="text-sm text-secondary-500">No forecast available.</p>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {weatherHours.map((hour) => (
                                        <div key={hour.time} className="border border-slate-200 rounded-lg p-3 bg-white">
                                            <div className="flex items-center gap-2 mb-1">
                                                <img src={hour.condition.icon} alt={hour.condition.text} className="w-6 h-6" />
                                                <span className="text-sm font-semibold text-secondary-600">{formatHour(hour.time)}</span>
                                            </div>
                                            <p className="text-sm text-secondary-500">{hour.condition.text}</p>
                                            <p className="text-sm font-semibold text-secondary-600">{hour.temp_c.toFixed(1)}°C</p>
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