$files = @(
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
    "detail_Web_Tv_production_video.html"
)

foreach ($file in $files) {
    $filePath = Join-Path $PSScriptRoot $file
    
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw -Encoding UTF8
        
        # Check if form-handler.js is already included
        if ($content -match "form-handler\.js") {
            Write-Host "✓ $file already has form-handler.js" -ForegroundColor Yellow
            continue
        }
        
        # Add script tag before </body>
        $scriptTag = "  <script src=`"form-handler.js`"></script>`r`n</body>"
        $content = $content -replace "</body>", $scriptTag
        
        Set-Content -Path $filePath -Value $content -Encoding UTF8 -NoNewline
        Write-Host "✓ Added form-handler.js to $file" -ForegroundColor Green
    } else {
        Write-Host "✗ File not found: $file" -ForegroundColor Red
    }
}

Write-Host "`n✅ Done! All files updated." -ForegroundColor Cyan
