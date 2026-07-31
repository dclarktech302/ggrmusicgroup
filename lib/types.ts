export interface SubscribeFormData {
    email: string;
    phone: string;
    communication_frequency: string;
    discovery_source: string;
    discovery_source_other: string;
    preferred_platform: string;
    satisfaction_rating: string;
    content_preferences: string[];
    content_preferences_other: string;
    would_share: string;
    consent_agreed: boolean;
}

export type SubscribeFormErrors = Partial<Record<keyof SubscribeFormData, string>>;
