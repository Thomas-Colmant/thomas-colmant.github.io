$files = Get-ChildItem -Path "c:\Users\colma\Desktop\thomas-colmant.github.io" -Filter "*.html" -Recurse

foreach ($f in $files) {
    if ($f.FullName -match 'node_modules|\.git') { continue }
    
    $content = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
    $modified = $false
    
    # Replace relative path (used in subdirectories)
    if ($content -match "\.\./fond ecran prod audioviusle\.png") {
        $content = $content -replace "\.\./fond ecran prod audioviusle\.png", "../web tv layover point.png"
        $modified = $true
    }
    
    # Replace root level reference if there are any typos or incorrect file names
    if ($content -match "/web tv - layover point\.png") {
        # The file is actually called "web tv layover point.png" without hyphen
        $content = $content -replace "/web tv - layover point\.png", "/web tv layover point.png"
        $modified = $true
    }
    
    if ($modified) {
        $utf8NoBom = New-Object System.Text.UTF8Encoding $false
        [System.IO.File]::WriteAllText($f.FullName, $content, $utf8NoBom)
        Write-Host "Updated $($f.FullName)"
    }
}
