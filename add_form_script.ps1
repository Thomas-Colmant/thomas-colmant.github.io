# Script to add form handling JavaScript to all HTML files

$formScript = @'

  <script>
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
  </script>
'@

$files = @(
    "photographie-personelle.html",
    "photographie.html",
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

foreach ($file in $files) {
    $filePath = Join-Path $PSScriptRoot $file
    
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw -Encoding UTF8
        
        # Check if script already exists
        if ($content -match "Form submission handling") {
            Write-Host "✓ $file already has the form script" -ForegroundColor Yellow
            continue
        }
        
        # Add script before </body>
        if ($content -match "</body>") {
            $newContent = $content -replace "</body>", "$formScript`r`n</body>"
            Set-Content -Path $filePath -Value $newContent -Encoding UTF8 -NoNewline
            Write-Host "✓ Added form script to $file" -ForegroundColor Green
        } else {
            Write-Host "✗ Could not find </body> in $file" -ForegroundColor Red
        }
    } else {
        Write-Host "✗ File not found: $file" -ForegroundColor Red
    }
}

Write-Host "`nDone! Form script added to all files." -ForegroundColor Cyan
