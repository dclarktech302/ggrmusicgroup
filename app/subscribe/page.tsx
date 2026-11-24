import { redirect } from 'next/navigation';
import { SIGNUP_URL } from '@/lib/signup';

// Old links to /subscribe (some carry ?email=) keep working: they land on the komi.io form, the one signup path.
// redirect() sends a temporary 307 to exactly SIGNUP_URL, so the old query is dropped. A next.config redirect would
// pass the query through to Komi.
export default function Subscribe() {
    redirect(SIGNUP_URL);
}
