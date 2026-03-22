$files = Get-ChildItem -Path "c:\Users\colma\Desktop\thomas-colmant.github.io" -Filter "*.html" -Recurse

$pattern = '(?m)^([ \t]*)<a href="/production-video" class="portfolio-card">\r?\n\s*<img src="\.\./fond ecran prod audioviusle\.png" alt="Production vidéo">\r?\n\s*<div class="portfolio-info">\r?\n\s*<h3>Production vidéo</h3>\r?\n\s*</div>\r?\n\s*</a>'

foreach ($f in $files) {
    $content = [System.IO.File]::ReadAllText($f.FullName)
    
    if ($content -match $pattern) {
        # Check if it was matching the BAD indentation (e.g., 24 spaces before img).
        # Actually, let's just replace all of them with the nice indentation.
        
        $newContent = [Regex]::Replace($content, $pattern, {
            param($match)
            $indent = $match.Groups[1].Value
            return "$indent<a href=`"/production-video`" class=`"portfolio-card`">`r`n$indent  <img src=`"../fond ecran prod audioviusle.png`" alt=`"Production vidéo`">`r`n$indent  <div class=`"portfolio-info`">`r`n$indent    <h3>Production vidéo</h3>`r`n$indent  </div>`r`n$indent</a>"
        })
        
        if ($newContent -cne $content) {
            [System.IO.File]::WriteAllText($f.FullName, $newContent, [System.Text.Encoding]::UTF8)
            Write-Host "Updated $($f.FullName)"
        }
    }
}
