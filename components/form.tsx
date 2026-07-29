'use client'

import { useState } from 'react';
import type { SubscribeFormData, SubscribeFormErrors } from '@/lib/types';

const initialData = (initialEmail?: string): SubscribeFormData => ({
    email: initialEmail || '',
    phone: '',
    communication_frequency: '',
    discovery_source: '',
    discovery_source_other: '',
    preferred_platform: '',
    satisfaction_rating: '',
    content_preferences: [],
    content_preferences_other: '',
    would_share: '',
    consent_agreed: false,
});

export default function SubscribeForm({ initialEmail }: { initialEmail?: string }) {
    const [data, setData] = useState<SubscribeFormData>(() => initialData(initialEmail));
    const [errors, setErrors] = useState<SubscribeFormErrors>({});
    const [serverError, setServerError] = useState('');
    const [processing, setProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox' && name === 'content_preferences') {
            setData((prev) => ({
                ...prev,
                content_preferences: checked
                    ? [...prev.content_preferences, value]
                    : prev.content_preferences.filter((item) => item !== value),
            }));
        } else if (type === 'checkbox') {
            setData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setData((prev) => ({ ...prev, [name]: value }));
        }

        if (errors[name as keyof SubscribeFormErrors]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[name as keyof SubscribeFormErrors];
                return next;
            });
        }
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setServerError('');

        try {
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok) {
                setShowSuccess(true);
                setIsSubmitted(true);
                setErrors({});
                setData(initialData());

                setTimeout(() => {
                    setShowSuccess(false);
                }, 5000);

                setTimeout(() => {
                    alert('Thank you for subscribing! You will receive updates based on your preferences.');
                }, 1000);
            } else if (response.status === 422) {
                setErrors(result.errors ?? {});
                setShowSuccess(false);
            } else {
                setServerError(result.error || 'We encountered an issue processing your subscription. Please try again later.');
                setShowSuccess(false);
            }
        } catch {
            setServerError('We encountered an issue processing your subscription. Please try again later.');
            setShowSuccess(false);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-black py-12">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto p-8 bg-gray-900/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-800">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold mb-3 text-white">Subscribe to GGR</h1>
                        <p className="text-gray-300 text-lg">
                            Sign up to receive exclusive alerts and help us shape what comes next!
                        </p>
                        <p className="text-sm text-gray-400 mt-2">* Indicates required question</p>
                    </div>

                    {/* Success Message */}
                    {showSuccess && (
                        <div className="mb-6 p-4 bg-green-900/50 border border-green-700 text-green-300 rounded-lg">
                            Thank you for subscribing! You will receive updates based on your preferences.
                        </div>
                    )}

                    {/* Error Message */}
                    {serverError && (
                        <div className="mb-6 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg">
                            {serverError}
                        </div>
                    )}

                    <form onSubmit={submit} className={`space-y-6 ${isSubmitted ? 'opacity-50 pointer-events-none' : ''}`}>
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 text-base font-medium text-white border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.email ? 'border-red-500 bg-red-900/30' : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                                    }`}
                                placeholder="email@example.com"
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Mobile Phone Number for Text Alerts <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={data.phone}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 text-base font-medium text-white border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.phone ? 'border-red-500 bg-red-900/30' : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                                    }`}
                                placeholder="(555) 123-4567"
                            />
                            {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
                        </div>

                        {/* Communication Frequency */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Preferred Communication Frequency for Text Alerts <span className="text-red-400">*</span>
                            </label>
                            <div className="space-y-2 text-gray-400">
                                <label className="flex items-start">
                                    <input
                                        type="radio"
                                        name="communication_frequency"
                                        value="weekly"
                                        checked={data.communication_frequency === 'weekly'}
                                        onChange={handleChange}
                                        className="mt-1 mr-3"
                                    />
                                    <span>Weekly Updates (Highlights and upcoming events)</span>
                                </label>
                                <label className="flex items-start">
                                    <input
                                        type="radio"
                                        name="communication_frequency"
                                        value="biweekly"
                                        checked={data.communication_frequency === 'biweekly'}
                                        onChange={handleChange}
                                        className="mt-1 mr-3"
                                    />
                                    <span>Bi-weekly Updates (Less frequent, major announcements only)</span>
                                </label>
                                <label className="flex items-start">
                                    <input
                                        type="radio"
                                        name="communication_frequency"
                                        value="urgent_only"
                                        checked={data.communication_frequency === 'urgent_only'}
                                        onChange={handleChange}
                                        className="mt-1 mr-3"
                                    />
                                    <span>Only for Urgent News/Special Offers (Very infrequent)</span>
                                </label>
                            </div>
                            {errors.communication_frequency && (
                                <p className="mt-1 text-sm text-red-400">{errors.communication_frequency}</p>
                            )}
                        </div>

                        {/* Discovery Source */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Where did you FIRST discover GGR Music Group? <span className="text-red-400">*</span>
                            </label>
                            <div className="space-y-2 text-gray-400">
                                {['Instagram', 'YouTube', 'Live event / performance', 'Friend or word of mouth', 'Search (Google, etc.)'].map(option => (
                                    <label key={option} className="flex items-center">
                                        <input
                                            type="radio"
                                            name="discovery_source"
                                            value={option.toLowerCase().replace(/[\s/()]/g, '_')}
                                            checked={data.discovery_source === option.toLowerCase().replace(/[\s/()]/g, '_')}
                                            onChange={handleChange}
                                            className="mr-3"
                                        />
                                        <span>{option}</span>
                                    </label>
                                ))}
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="discovery_source"
                                        value="other"
                                        checked={data.discovery_source === 'other'}
                                        onChange={handleChange}
                                        className="mr-3"
                                    />
                                    <span>Other:</span>
                                </label>
                                {data.discovery_source === 'other' && (
                                    <input
                                        type="text"
                                        name="discovery_source_other"
                                        value={data.discovery_source_other}
                                        onChange={handleChange}
                                        className="ml-8 w-full px-4 py-3 text-base font-medium text-white border-2 border-gray-700 rounded-xl bg-gray-800 hover:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Please specify"
                                    />
                                )}
                            </div>
                            {errors.discovery_source && (
                                <p className="mt-1 text-sm text-red-400">{errors.discovery_source}</p>
                            )}
                        </div>

                        {/* Preferred Platform */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Where would you MOST like to see more GGR content in the future? <span className="text-red-400">*</span>
                            </label>
                            <div className="space-y-2 text-gray-400">
                                {['Instagram', 'TikTok', 'YouTube', 'Facebook', 'X (Formally Twitter)', 'Short-form video (Reels / TikTok / Shorts)', 'Long-form video (YouTube)', 'Live Streams'].map(option => (
                                    <label key={option} className="flex items-center">
                                        <input
                                            type="radio"
                                            name="preferred_platform"
                                            value={option.toLowerCase().replace(/[\s/()]/g, '_')}
                                            checked={data.preferred_platform === option.toLowerCase().replace(/[\s/()]/g, '_')}
                                            onChange={handleChange}
                                            className="mr-3"
                                        />
                                        <span>{option}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.preferred_platform && (
                                <p className="mt-1 text-sm text-red-500">{errors.preferred_platform}</p>
                            )}
                        </div>

                        {/* Satisfaction Rating */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                How satisfied are you with the content we currently share on social media? <span className="text-red-500">*</span>
                            </label>
                            <p className="text-sm text-gray-400 mb-3">1 = Very Dissatisfied · 3 = Neutral · 5 = Very Satisfied</p>
                            <div className="flex items-center space-x-2 text-gray-400">
                                <span className="text-sm">Very Dissatisfied</span>
                                {[1, 2, 3, 4, 5].map(rating => (
                                    <label key={rating} className="flex flex-col items-center">
                                        <span className="text-sm mb-1">{rating}</span>
                                        <input
                                            type="radio"
                                            name="satisfaction_rating"
                                            value={rating}
                                            checked={data.satisfaction_rating === String(rating)}
                                            onChange={handleChange}
                                            className="w-5 h-5"
                                        />
                                    </label>
                                ))}
                                <span className="text-sm">Very Satisfied</span>
                            </div>
                            {errors.satisfaction_rating && (
                                <p className="mt-1 text-sm text-red-500">{errors.satisfaction_rating}</p>
                            )}
                        </div>

                        {/* Content Preferences */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                What kind of content would you like to see more of on our social media channels? <span className="text-red-500">*</span>
                            </label>
                            <div className="space-y-2 text-gray-400">
                                {[
                                    'Behind-the-scenes footage',
                                    'Exclusive interviews with talent',
                                    'Giveaways and contests',
                                    'Event highlights and recaps',
                                    'Upcoming schedule previews',
                                    'Fan spotlights and interactions'
                                ].map(option => (
                                    <label key={option} className="flex items-start">
                                        <input
                                            type="checkbox"
                                            name="content_preferences"
                                            value={option.toLowerCase().replace(/[\s-]/g, '_')}
                                            checked={data.content_preferences.includes(option.toLowerCase().replace(/[\s-]/g, '_'))}
                                            onChange={handleChange}
                                            className="mt-1 mr-3"
                                        />
                                        <span>{option}</span>
                                    </label>
                                ))}
                                <label className="flex items-start">
                                    <input
                                        type="checkbox"
                                        name="content_preferences"
                                        value="other"
                                        checked={data.content_preferences.includes('other')}
                                        onChange={handleChange}
                                        className="mt-1 mr-3"
                                    />
                                    <span>Other:</span>
                                </label>
                                {data.content_preferences.includes('other') && (
                                    <input
                                        type="text"
                                        name="content_preferences_other"
                                        value={data.content_preferences_other}
                                        onChange={handleChange}
                                        className="ml-8 w-full px-4 py-3 text-base font-medium text-gray-900 border-2 border-gray-300 rounded-xl bg-white hover:border-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Please specify"
                                    />
                                )}
                            </div>
                            {errors.content_preferences && (
                                <p className="mt-1 text-sm text-red-500">{errors.content_preferences}</p>
                            )}
                        </div>

                        {/* Would Share */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Would you share GGR content with friends if it appeared on your preferred platform? <span className="text-red-500">*</span>
                            </label>
                            <div className="space-y-2 text-gray-400">
                                {['Yes', 'Maybe', 'No'].map(option => (
                                    <label key={option} className="flex items-center">
                                        <input
                                            type="radio"
                                            name="would_share"
                                            value={option.toLowerCase()}
                                            checked={data.would_share === option.toLowerCase()}
                                            onChange={handleChange}
                                            className="mr-3"
                                        />
                                        <span>{option}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.would_share && (
                                <p className="mt-1 text-sm text-red-500">{errors.would_share}</p>
                            )}
                        </div>

                        {/* Consent Disclaimer */}
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <h3 className="text-lg text-gray-700 font-semibold mb-3">Text Message & Privacy Consent Disclaimer</h3>
                            <div className="text-sm text-gray-700 space-y-2 mb-4">
                                <p>
                                    By submitting this form, you consent to receive email and/or SMS text messages from GGR Music Group related to updates, promotions, events, and announcements based on your selected preferences.
                                </p>
                                <p>
                                    Message frequency may vary. Standard message and data rates may apply. You may opt out of SMS communications at any time by replying STOP to any text message. For help, reply HELP or contact us at <a href="mailto:info@ggrmusic.com" className="text-blue-600 underline">info@ggrmusic.com</a>.
                                </p>
                                <p>
                                    Your personal information will be used solely for communication purposes and will not be sold or shared with third parties except as required to deliver messaging services or comply with applicable laws.
                                </p>
                                <p>
                                    By submitting this form, you confirm that you are at least 18 years old and agree to these terms.
                                </p>
                            </div>
                            <label className="flex items-start">
                                <input
                                    type="checkbox"
                                    name="consent_agreed"
                                    checked={data.consent_agreed}
                                    onChange={handleChange}
                                    className={`mt-1 mr-3 ${errors.consent_agreed ? 'border-red-500' : ''}`}
                                />
                                <span className="text-sm font-medium text-gray-500">
                                    I understand and agree to the disclaimer. <span className="text-red-500">*</span>
                                </span>
                            </label>
                            {errors.consent_agreed && (
                                <p className="mt-1 text-sm text-red-500">{errors.consent_agreed}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={processing || isSubmitted}
                                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg text-white transition-all duration-300 transform ${processing || isSubmitted
                                    ? 'bg-gray-600 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 hover:scale-[1.02] active:scale-[0.98]'
                                    }`}
                            >
                                {processing ? 'Submitting...' : isSubmitted ? 'Subscribed!' : 'Subscribe Now'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
