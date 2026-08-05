param(
    [Parameter(Mandatory = $true, Position = 0)]
    [ValidateSet("dev", "prod")]
    [string]$TargetEnvironment,

    [string]$EnvFile,

    [string]$Namespace = "default"
)

$ErrorActionPreference = "Stop"

$rootDir = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$projectRoot = $rootDir.Path

if (-not $EnvFile) {
    $EnvFile = Join-Path $projectRoot ".env.$TargetEnvironment.k8s"
}

$secretPrefix = "yukikaze-player"

if (-not (Test-Path $EnvFile)) {
    throw "Missing env file: $EnvFile"
}

if (-not (Get-Command kubectl -ErrorAction SilentlyContinue)) {
    throw "kubectl is required but was not found in PATH."
}

$secretKeys = @(
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "CLOUDINARY_CLOUD_NAME",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_REDIRECT_URI",
    "FACEBOOK_CLIENT_ID",
    "FACEBOOK_CLIENT_SECRET",
    "FACEBOOK_REDIRECT_URI",
    "ACCESS_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRES_IN",
    "REFRESH_TOKEN_SECRET",
    "REFRESH_TOKEN_EXPIRES_IN",
    "MYSQL_DATABASE",
    "MYSQL_HOST",
    "MYSQL_PASSWORD",
    "MYSQL_PORT",
    "MYSQL_SSL_MODE",
    "MYSQL_USER",
    "REDIS_URL",
    "REDIS_HOST",
    "REDIS_PORT",
    "REDIS_MAX_CONNECTION_RETRY",
    "REDIS_MIN_CONNECTION_DELAY_IN_MS",
    "REDIS_MAX_CONNECTION_DELAY_IN_MS",
    "KAFKA_BROKERS",
    "KAFKA_CLIENT_ID",
    "KAFKA_COMMENT_REPLY_TOPIC",
    "KAFKA_COMMENT_REPLY_GROUP_ID",
    "KAFKA_CHAT_EVENTS_TOPIC",
    "KAFKA_CHAT_EVENTS_GROUP_ID",
    "KAFKA_SASL_USERNAME",
    "KAFKA_SASL_PASSWORD",
    "WEB_PUSH_SUBJECT",
    "WEB_PUSH_PRIVATE_KEY",
    "RESEND_API_KEY"
)

$secretSet = @{}
foreach ($key in $secretKeys) {
    $secretSet[$key] = $true
}

$envVars = @{}
$orderedKeys = New-Object System.Collections.Generic.List[string]

function Trim-Value {
    param([string]$Value)
    $trimmed = $Value.Trim()
    if ($trimmed -match '^(.*?)(\s+#.*)?$') {
        $trimmed = $Matches[1].Trim()
    }
    return $trimmed.Trim('"')
}

Get-Content $EnvFile | ForEach-Object {
    $line = $_.Trim()
    if ([string]::IsNullOrWhiteSpace($line) -or $line.StartsWith("#")) {
        return
    }
    $equalsIndex = $line.IndexOf("=")
    if ($equalsIndex -lt 1) {
        return
    }

    $key = $line.Substring(0, $equalsIndex).Trim()
    $value = $line.Substring($equalsIndex + 1)
    $value = Trim-Value -Value $value

    if (-not $envVars.ContainsKey($key)) {
        $orderedKeys.Add($key) | Out-Null
    }
    $envVars[$key] = $value
}

if ($orderedKeys.Count -eq 0) {
    throw "No environment variables parsed from: $EnvFile"
}

$tmpDir = [System.IO.Path]::GetTempPath()
$tmpSecret = Join-Path $tmpDir ("yukikaze-player-secret.{0}.env" -f ([guid]::NewGuid().ToString("N")))
$tmpConfig = Join-Path $tmpDir ("yukikaze-player-config.{0}.env" -f ([guid]::NewGuid().ToString("N")))

try {
    foreach ($key in $orderedKeys) {
        $value = $envVars[$key]
        $line = "{0}={1}" -f $key, $value

        if ($secretSet.ContainsKey($key)) {
            Add-Content -Path $tmpSecret -Value $line
        } else {
            Add-Content -Path $tmpConfig -Value $line
        }
    }

    if ((Test-Path $tmpSecret) -and (Get-Item $tmpSecret).Length -gt 0) {
        & kubectl -n $Namespace create secret generic "$secretPrefix-secrets-$TargetEnvironment" --from-env-file=$tmpSecret --dry-run=client -o yaml | & kubectl -n $Namespace apply -f -
    }

    if ((Test-Path $tmpConfig) -and (Get-Item $tmpConfig).Length -gt 0) {
        & kubectl -n $Namespace create configmap "$secretPrefix-config-$TargetEnvironment" --from-env-file=$tmpConfig --dry-run=client -o yaml | & kubectl -n $Namespace apply -f -
    }

    Write-Host ("Synced environment '{0}' from {1} into namespace '{2}'." -f $TargetEnvironment, $EnvFile, $Namespace)
}
finally {
    if (Test-Path $tmpSecret) { Remove-Item -Path $tmpSecret -Force -ErrorAction SilentlyContinue }
    if (Test-Path $tmpConfig) { Remove-Item -Path $tmpConfig -Force -ErrorAction SilentlyContinue }
}
