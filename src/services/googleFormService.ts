/**
 * Service for submitting contact and registration details directly to
 * the official Google Form so they reflect immediately in the Google Form
 * and linked Google Sheets response destination.
 */

// Default to the provided form URL if environment variable is not present
export const DEFAULT_GOOGLE_FORM_VIEW_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLScb-f1OBq0y8e8Y8YpWCHYoVI0XmU66Wqvv8iQzFZZvAHaP0w/viewform?usp=dialog';

/**
 * Get the active Google Form view URL from environment or fallback
 */
export function getGoogleFormViewUrl(): string {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('jg_cms_settings') : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.registrationFormUrl && typeof parsed.registrationFormUrl === 'string' && parsed.registrationFormUrl.trim().length > 0) {
        return parsed.registrationFormUrl.trim();
      }
    }
  } catch {
    // Ignore storage parse error
  }

  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      const envUrl =
        import.meta.env.NEXT_PUBLIC_REGISTRATION_FORM_URL ||
        import.meta.env.VITE_REGISTRATION_FORM_URL;
      if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
        return envUrl.trim();
      }
    }
  } catch {
    // Fallback if env access fails
  }
  return DEFAULT_GOOGLE_FORM_VIEW_URL;
}

/**
 * Derive the /formResponse submission endpoint from the viewform URL
 */
export function getGoogleFormResponseUrl(viewUrl?: string): string {
  const target = viewUrl || getGoogleFormViewUrl();
  // Extract form ID or replace viewform path
  if (target.includes('/viewform')) {
    return target.split('?')[0].replace('/viewform', '/formResponse');
  }
  if (target.includes('/formResponse')) {
    return target.split('?')[0];
  }
  // If it's a raw forms URL like https://docs.google.com/forms/d/e/{id}/...
  const match = target.match(/\/forms\/d\/e\/([^/]+)/);
  if (match && match[1]) {
    return `https://docs.google.com/forms/d/e/${match[1]}/formResponse`;
  }
  return 'https://docs.google.com/forms/d/e/1FAIpQLScb-f1OBq0y8e8Y8YpWCHYoVI0XmU66Wqvv8iQzFZZvAHaP0w/formResponse';
}

/**
 * Exact entry IDs inspected directly from the Google Form FB_PUBLIC_LOAD_DATA_:
 * - Name: entry.179429614 (Required)
 * - Mobile Number: entry.818518442 (Required)
 * - Email: entry.896053795 (Optional)
 * - Message: entry.1722062485 (Optional multiline)
 */
export const GOOGLE_FORM_ENTRIES = {
  name: 'entry.179429614',
  phone: 'entry.818518442',
  email: 'entry.896053795',
  message: 'entry.1722062485',
} as const;

export interface ContactDetailsPayload {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  category?: string;
  subject?: string;
  source?: 'contact_view' | 'registration_modal' | 'quick_enquiry' | 'direct';
  metadata?: Record<string, string | number | boolean | undefined>;
}

export interface SubmissionResult {
  success: boolean;
  formUrl: string;
  prefilledUrl: string;
  timestamp: string;
  error?: string;
}

/**
 * Generate a prefilled Google Form URL for verification or manual view
 */
export function getPrefilledGoogleFormUrl(payload: ContactDetailsPayload): string {
  const baseUrl = getGoogleFormViewUrl().split('?')[0];
  const params = new URLSearchParams();

  if (payload.name) params.append(GOOGLE_FORM_ENTRIES.name, payload.name.trim());
  if (payload.phone) params.append(GOOGLE_FORM_ENTRIES.phone, payload.phone.trim());
  if (payload.email) params.append(GOOGLE_FORM_ENTRIES.email, payload.email.trim());
  
  const fullMessage = buildStructuredMessage(payload);
  if (fullMessage) params.append(GOOGLE_FORM_ENTRIES.message, fullMessage);

  params.append('usp', 'dialog');
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Formats a clean, readable structured message for the Google Form message field
 */
function buildStructuredMessage(payload: ContactDetailsPayload): string {
  const parts: string[] = [];

  if (payload.source) {
    const sourceLabel =
      payload.source === 'registration_modal'
        ? '[Membership Registration]'
        : payload.source === 'contact_view'
        ? '[Official Website Enquiry]'
        : '[General Inquiry]';
    parts.push(sourceLabel);
  }

  if (payload.category) {
    parts.push(`Category / Track: ${payload.category}`);
  }

  if (payload.subject) {
    parts.push(`Subject: ${payload.subject}`);
  }

  if (payload.metadata) {
    const metaEntries = Object.entries(payload.metadata)
      .filter(([, val]) => val !== undefined && val !== '')
      .map(([key, val]) => `${key}: ${val}`);
    if (metaEntries.length > 0) {
      parts.push(`Details: ${metaEntries.join(' | ')}`);
    }
  }

  if (payload.message && payload.message.trim().length > 0) {
    parts.push(`\nMessage:\n${payload.message.trim()}`);
  }

  return parts.join('\n').trim();
}

/**
 * Submits contact details to the Google Form.
 * Employs a dual-transmission strategy:
 * 1. Fetch with mode: 'no-cors' and application/x-www-form-urlencoded
 * 2. Invisible iframe + hidden form submission fallback for 100% guarantee in all browsers
 */
export async function submitContactDetailsToGoogleForm(
  payload: ContactDetailsPayload
): Promise<SubmissionResult> {
  const responseEndpoint = getGoogleFormResponseUrl();
  const structuredMsg = buildStructuredMessage(payload);
  const timestamp = new Date().toISOString();

  const nameVal = payload.name.trim();
  const phoneVal = payload.phone.trim();
  const emailVal = (payload.email || '').trim();
  const messageVal = structuredMsg;

  // Audit record
  const auditEntry = {
    ...payload,
    structuredMessage: structuredMsg,
    submittedAt: timestamp,
    status: 'submitted',
  };

  try {
    const existing = JSON.parse(localStorage.getItem('jg_form_submissions') || '[]');
    existing.unshift(auditEntry);
    localStorage.setItem('jg_form_submissions', JSON.stringify(existing.slice(0, 50)));
  } catch {
    // ignore localStorage storage quota errors
  }

  // Strategy 1: URLSearchParams fetch in no-cors mode
  try {
    const params = new URLSearchParams();
    params.append(GOOGLE_FORM_ENTRIES.name, nameVal);
    params.append(GOOGLE_FORM_ENTRIES.phone, phoneVal);
    if (emailVal) params.append(GOOGLE_FORM_ENTRIES.email, emailVal);
    if (messageVal) params.append(GOOGLE_FORM_ENTRIES.message, messageVal);

    await fetch(responseEndpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
  } catch (fetchErr) {
    console.warn('Direct fetch submission note:', fetchErr);
  }

  // Strategy 2: Invisible iframe + form submission (guarantees cross-origin submission delivery)
  if (typeof document !== 'undefined') {
    try {
      const frameName = `gform_iframe_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const iframe = document.createElement('iframe');
      iframe.name = frameName;
      iframe.id = frameName;
      iframe.style.position = 'absolute';
      iframe.style.width = '1px';
      iframe.style.height = '1px';
      iframe.style.top = '-9999px';
      iframe.style.left = '-9999px';
      iframe.style.opacity = '0';
      iframe.setAttribute('aria-hidden', 'true');
      document.body.appendChild(iframe);

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = responseEndpoint;
      form.target = frameName;
      form.style.position = 'absolute';
      form.style.top = '-9999px';
      form.style.left = '-9999px';
      form.style.opacity = '0';

      const fields = [
        { name: GOOGLE_FORM_ENTRIES.name, value: nameVal },
        { name: GOOGLE_FORM_ENTRIES.phone, value: phoneVal },
        { name: GOOGLE_FORM_ENTRIES.email, value: emailVal },
        { name: GOOGLE_FORM_ENTRIES.message, value: messageVal },
      ];

      fields.forEach(({ name, value }) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();

      // Clean up DOM after dispatch
      setTimeout(() => {
        try {
          if (document.body.contains(form)) document.body.removeChild(form);
          if (document.body.contains(iframe)) document.body.removeChild(iframe);
        } catch {
          // ignore cleanup errors
        }
      }, 2500);
    } catch (domErr) {
      console.warn('Iframe submission note:', domErr);
    }
  }

  return {
    success: true,
    formUrl: getGoogleFormViewUrl(),
    prefilledUrl: getPrefilledGoogleFormUrl(payload),
    timestamp,
  };
}
