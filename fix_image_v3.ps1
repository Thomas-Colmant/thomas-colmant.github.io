$files = Get-ChildItem -Path "c:\Users\colma\Desktop\thomas-colmant.github.io" -Filter "*.html" -Recurse

$oldSub = "../fond ecran prod audioviusle.png"
$newSub = "../web tv layover point.png"
$oldRoot = "/web tv - layover point.png"
$newRoot = "/web tv layover point.png"

$count = 0
foreach ($f in $files) {
    if ($f.FullName -match 'node_modules|\.git') { continue }
    
    $content = [System.IO.File]::ReadAllText($f.FullName, [System.Text.Encoding]::UTF8)
    $modified = $false
    
    if ($content.Contains($oldSub)) {
        $content = $content.Replace($oldSub, $newSub)
        $modified = $true
    }
    
    if ($content.Contains($oldRoot)) {
        $content = $content.Replace($oldRoot, $newRoot)
        $modified = $true
    }
    
    if ($modified) {
        $utf8NoBom = New-Object System.Text.UTF8Encoding $false
        [System.IO.File]::WriteAllText($f.FullName, $content, $utf8NoBom)
        Write-Host "Updated $($f.FullName)"
        $count++
    }
}
Write-Host "Total files updated: $count"
