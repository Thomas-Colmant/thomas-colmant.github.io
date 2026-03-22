$files = Get-ChildItem -Path "c:\Users\colma\Desktop\thomas-colmant.github.io" -Filter "*.html" -Recurse

$pattern = '(?m)^([ \t]*)<a href="/production-video" class="portfolio-card">\r?\n\s*<img src="\.\./fond ecran prod audioviusle\.png" alt="Production vidéo">\r?\n\s*<div class="portfolio-info">\r?\n\s*<h3>Production vidéo</h3>\r?\n\s*</div>\r?\n\s*</a>'

foreach ($f in $files) {
    # Read as UTF-8
    $content = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
    
    if ($content -match $pattern) {
        $newContent = [Regex]::Replace($content, $pattern, {
            param($match)
            $indent = $match.Groups[1].Value
            return "$indent<a href=`"/production-video`" class=`"portfolio-card`">`r`n$indent  <img src=`"../fond ecran prod audioviusle.png`" alt=`"Production vidéo`">`r`n$indent  <div class=`"portfolio-info`">`r`n$indent    <h3>Production vidéo</h3>`r`n$indent  </div>`r`n$indent</a>"
        })
        
        if ($newContent -cne $content) {
            # Make sure it's written as UTF-8 WITHOUT BOM
            $utf8NoBom = New-Object System.Text.UTF8Encoding $false
            [System.IO.File]::WriteAllText($f.FullName, $newContent, $utf8NoBom)
            Write-Host "Updated $($f.FullName)"
        }
    }
}
