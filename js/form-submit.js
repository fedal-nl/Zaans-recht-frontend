import { API_URL } from './api.js';

let appointmentWidgetId = null;
let contactWidgetId = null;

// Attach form logic AFTER captcha renders
function onloadRecaptcha() {
    console.log('reCAPTCHA API loaded, rendering widgets...');

    // Render the appointment form CAPTCHA
    const appointmentDiv = document.getElementById('captchaAppointment');
    if (appointmentDiv) {
        appointmentWidgetId = grecaptcha.render(appointmentDiv, {
            sitekey: '6Lcam_srAAAAAOxgfnoik-nEGZqvWc8A1NtupfG9',
        });
        console.log('Rendered appointment CAPTCHA, widget ID:', appointmentWidgetId);
    }

    // Render the contact form CAPTCHA
    const contactDiv = document.getElementById('captchaContact');
    if (contactDiv) {
        contactWidgetId = grecaptcha.render(contactDiv, {
            sitekey: '6Lcam_srAAAAAOxgfnoik-nEGZqvWc8A1NtupfG9',
        });
        console.log('Rendered contact CAPTCHA, widget ID:', contactWidgetId);
    }

    // Now attach event listeners (AFTER widget IDs exist)
    const appointmentForm = document.getElementById('appointmentForm');
    const contactForm = document.getElementById('contactForm');

    if (appointmentForm && appointmentWidgetId !== null) {
        handleFormSubmit(appointmentForm, appointmentWidgetId, appointmentSuccess);
    }
    if (contactForm && contactWidgetId !== null) {
        handleFormSubmit(contactForm, contactWidgetId, contactSuccess);
    }
}

function handleFormSubmit(formElement, widgetId, onSuccess) {
    formElement.addEventListener('submit', async function (e) {
        e.preventDefault();

        console.log('Submitting form:', formElement.id);

        const token = grecaptcha.getResponse(widgetId);
        console.log('Getting CAPTCHA response for widget ID:', widgetId);
        console.log('CAPTCHA token response:', token);

        if (!token) {
            alert('Bevestig a.u.b. dat u geen robot bent.');
            return;
        }

        const formData = new FormData(formElement);
        // convert FormData to plain object to be converted to JSON later
        const plainData = Object.fromEntries(formData.entries());
        console.log('Form data as plain object:', plainData);
        // convert the form to contain the full_name field if firstName and lastName are present
        if (plainData.firstName && plainData.lastName) {
            plainData.full_name = `${plainData.firstName} ${plainData.lastName}`;
        }

        // convert the desiredDate and desiredTime fields into a single meeting_datetime field
        if (plainData.desiredDate && plainData.desiredTime) {
            plainData.meeting_datetime = `${plainData.desiredDate}T${plainData.desiredTime}:00`;
        }

        // Remove individual fields that were combined
        delete plainData.firstName;
        delete plainData.lastName;
        delete plainData.desiredDate;
        delete plainData.desiredTime;

        // also remove the recaptcha response from the data to be sent because the token is sent in the Authorization header
        delete plainData['g-recaptcha-response'];

        const jsonBody = JSON.stringify(plainData);
        
        console.log('Form JSON body:', jsonBody);

        const submitButton = formElement.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;

        submitButton.textContent = 'Bezig met verzenden...';
        submitButton.disabled = true;

        try {
            const response = await fetch(`${API_URL}/forms/zaansrecht`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: jsonBody,
            });

            if (!response.ok) {
                throw new Error(`Server responded with status ${response.status}`);
            }

            onSuccess(formElement, submitButton, originalText);
            grecaptcha.reset(widgetId);
        } catch (err) {
            console.error('Error submitting form:', err);
            alert('Er ging iets mis bij het verzenden. Probeer het later opnieuw.');
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });
}

function appointmentSuccess(form, submitButton, originalText) {
    alert('Afspraak succesvol aangevraagd!');
    form.reset();
}

function contactSuccess(form, submitButton, originalText) {
    form.style.display = 'none';
    document.getElementById('contactFormSuccess').classList.remove('hidden');
    setTimeout(() => {
        form.reset();
        form.style.display = 'block';
        document.getElementById('contactFormSuccess').classList.add('hidden');
    }, 5000);
}
