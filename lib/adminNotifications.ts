import { supabase } from '@/lib/supabaseClient';

export async function notifyAllUsers(
  title: string,
  message: string,
  type: 'update' | 'announcement' = 'announcement',
  link?: string
) {
  try {
    const { data, error } = await supabase.rpc('notify_all_users', {
      p_title: title,
      p_message: message,
      p_type: type,
      p_link: link || null,
    });

    if (error) throw error;
    return { success: true, count: data };
  } catch (error) {
    console.error('Error notifying users:', error);
    return { success: false, error };
  }
}

export async function notifyUser(
  userId: string,
  title: string,
  message: string,
  type: string,
  link?: string,
  metadata?: any
) {
  try {
    const { data, error } = await supabase.rpc('create_user_notification', {
      p_user_id: userId,
      p_title: title,
      p_message: message,
      p_type: type,
      p_link: link || null,
      p_metadata: metadata || null,
    });

    if (error) throw error;
    return { success: true, notificationId: data };
  } catch (error) {
    console.error('Error notifying user:', error);
    return { success: false, error };
  }
}

