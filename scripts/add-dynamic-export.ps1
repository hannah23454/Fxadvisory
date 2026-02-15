# Script to add dynamic export to all client component pages
$files = Get-ChildItem -Path "app/dashboard" -Filter "page.tsx" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Check if it's a client component and doesn't already have dynamic export
    if ($content -match '"use client"' -and $content -notmatch 'export const dynamic') {
        Write-Host "Adding dynamic export to: $($file.FullName)"
        
        # Add export const dynamic after "use client"
        $newContent = $content -replace '("use client"\r?\n)', '$1`nexport const dynamic = ''force-dynamic'';`n'
        
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
    }
}

Write-Host "Done!"
