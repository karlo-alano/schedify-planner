import { supabase } from '../lib/supabase';

// Type definitions
export interface Event {
  id: string;
  created_at: string;
  event_name: string;
  event_date: string; // Date in YYYY-MM-DD format
  event_time: string; // Time in HH:MM:SS format
  event_description?: string;
  event_picture?: string;
  user_id: string;
}

export interface CreateEventData {
  event_name: string;
  event_date: string;
  event_time: string;
  event_description?: string;
  event_picture?: string;
  user_id: string;
}

export interface UpdateEventData {
  event_name?: string;
  event_date?: string;
  event_time?: string;
  event_description?: string;
  event_picture?: string;
}

// Database connection check
export async function checkDatabaseConnection(): Promise<{ connected: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('events').select('id').limit(1);
    if (error) {
      return { connected: false, error: error.message };
    }
    return { connected: true };
  } catch (error) {
    return { connected: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Insert/Create new event
export async function createEvent(eventData: CreateEventData): Promise<{ data: Event | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single();

    if (error) {
      console.error('Error creating event:', error);
      return { data: null, error: error.message };
    }

    return { data: data as Event, error: null };
  } catch (error) {
    console.error('Unexpected error creating event:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}

// Select/Get events
export async function getAllEvents(): Promise<{ data: Event[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true })
      .order('event_time', { ascending: true });

    if (error) {
      console.error('Error fetching all events:', error);
      return { data: null, error: error.message };
    }

    return { data: data as Event[], error: null };
  } catch (error) {
    console.error('Unexpected error fetching events:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}

export async function getEventsByUserId(userId: string): Promise<{ data: Event[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', userId)
      .order('event_date', { ascending: true })
      .order('event_time', { ascending: true });

    if (error) {
      console.error('Error fetching events for user:', error);
      return { data: null, error: error.message };
    }

    return { data: data as Event[], error: null };
  } catch (error) {
    console.error('Unexpected error fetching user events:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}

export async function getEventById(eventId: string): Promise<{ data: Event | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (error) {
      console.error('Error fetching event by ID:', error);
      return { data: null, error: error.message };
    }

    return { data: data as Event, error: null };
  } catch (error) {
    console.error('Unexpected error fetching event:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}

export async function getUpcomingEvents(limit?: number): Promise<{ data: Event[] | null; error: string | null }> {
  try {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    let query = supabase
      .from('events')
      .select('*')
      .gte('event_date', today)
      .order('event_date', { ascending: true })
      .order('event_time', { ascending: true });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching upcoming events:', error);
      return { data: null, error: error.message };
    }

    return { data: data as Event[], error: null };
  } catch (error) {
    console.error('Unexpected error fetching upcoming events:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}

// Update event
export async function updateEvent(eventId: string, updateData: UpdateEventData): Promise<{ data: Event | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('events')
      .update(updateData)
      .eq('id', eventId)
      .select()
      .single();

    if (error) {
      console.error('Error updating event:', error);
      return { data: null, error: error.message };
    }

    return { data: data as Event, error: null };
  } catch (error) {
    console.error('Unexpected error updating event:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}

// Delete event
export async function deleteEvent(eventId: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) {
      console.error('Error deleting event:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Unexpected error deleting event:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}

// Delete all events for a user
export async function deleteEventsByUserId(userId: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting user events:', error);
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Unexpected error deleting user events:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}

// Upload event image to Supabase Storage
export async function uploadEventImage(file: File, eventId: string): Promise<{ url: string | null; error: string | null }> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${eventId}_${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from('events_pictures') // Make sure this bucket exists in your Supabase dashboard
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading image:', error);
      return { url: null, error: error.message };
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('events_pictures')
      .getPublicUrl(fileName);

    return { url: urlData.publicUrl, error: null };
  } catch (error) {
    console.error('Unexpected error uploading image:', error);
    return { url: null, error: error instanceof Error ? error.message : 'Upload failed' };
  }
}
