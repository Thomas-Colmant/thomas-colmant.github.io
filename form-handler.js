// Form submission handling
const form = document.getElementById('form');
const submitBtn = document.getElementById('submit-btn');

if (form) {
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi en cours...';

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                alert('✅ Merci pour votre message ! Je vous répondrai bientôt.');
                form.reset();
            } else {
                const data = await response.json();
                console.error('Response data:', data);

                if (data.errors) {
                    alert('❌ Erreur : ' + data.errors.map(e => e.message).join(', '));
                } else if (data.error) {
                    alert('❌ Erreur : ' + data.error);
                } else {
                    alert('❌ Erreur ' + response.status + '. Ouvre la console (F12) pour plus de détails.');
                }
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('❌ Erreur de connexion. Veuillez vérifier votre connexion internet.');
        } finally {
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Envoyer un message';
        }
    });
}
