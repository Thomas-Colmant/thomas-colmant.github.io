$files = @(
    "photographie-personelle.html",
    "Montage_Motion_Design.html",
    "detail_affiche_BMW.html",
    "detail_affiche_mohammed_ali.html",
    "detail_affiche_programme.html",
    "detail_affiche_PSG_Toulouse.html",
    "detail_affiche_ronaldo.html",
    "detail_affiche_sensibilisation.html",
    "detail_affiche_ThomasPesquet_Megumi.html",
    "detail_animation_Discord.html",
    "detail_animation_google.html",
    "detail_animation_mac.html",
    "detail_montage_ete.html",
    "detail_MotionDeisgn_logo_QG.html",
    "detail_Web_Tv_production_video.html",
    "Affiche_Graphisme.html",
    "production_vidéo.html"
)

$newFormScript = @'
    // Form submission handling
    const form = document.getElementById('form');
    const submitBtn = document.getElementById('submit-btn');

    if (form) {
      form.addEventListener('submit', async function(e) {
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
'@

foreach ($file in $files) {
    $filePath = Join-Path $PSScriptRoot $file
    
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw -Encoding UTF8
        
        # Pattern to match old Formspree code
        $oldPattern = '(?s)    // Formspree.*?    \}\);'
        
        if ($content -match $oldPattern) {
            $content = $content -replace $oldPattern, $newFormScript
            Set-Content -Path $filePath -Value $content -Encoding UTF8 -NoNewline
            Write-Host "✓ Updated $file" -ForegroundColor Green
        } else {
            Write-Host "⚠ No old Formspree code found in $file" -ForegroundColor Yellow
        }
    } else {
        Write-Host "✗ File not found: $file" -ForegroundColor Red
    }
}

Write-Host "`n✅ Done!" -ForegroundColor Cyan
