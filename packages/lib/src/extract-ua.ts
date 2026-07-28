export type DeviceType =
    | 'bot'
    | 'console'
    | 'desktop'
    | 'embedded'
    | 'mobile'
    | 'smarttv'
    | 'tablet'
    | 'unknown'
    | 'wearable'

export type CpuArchitecture =
    | 'amd64'
    | 'arm'
    | 'arm64'
    | 'ia32'
    | 'ia64'
    | 'loong64'
    | 'mips'
    | 'mips64'
    | 'ppc'
    | 'ppc64'
    | 'riscv64'
    | 'sparc'
    | 'unknown'

export type BrowserInfo = {
    name: string
    version: string
    major: string
}

export type EngineInfo = {
    name: string
    version: string
}

export type OsInfo = {
    name: string
    version: string
}

export type DeviceInfo = {
    type: DeviceType
    vendor: string
    model: string
}

export type CpuInfo = {
    architecture: CpuArchitecture
}

export type UserAgentInfo = {
    userAgent: string
    browser: BrowserInfo
    engine: EngineInfo
    os: OsInfo
    device: DeviceInfo
    cpu: CpuInfo
}

type DetectionRule = {
    name: string
    pattern: RegExp
}

const UNKNOWN = 'Unknown'
const MAX_USER_AGENT_LENGTH = 2048

const BROWSER_RULES: readonly DetectionRule[] = [
    { name: 'Googlebot', pattern: /\bGooglebot\/([\d.]+)/i },
    { name: 'Bingbot', pattern: /\bbingbot\/([\d.]+)/i },
    { name: 'YandexBot', pattern: /\bYandexBot\/([\d.]+)/i },
    { name: 'DuckDuckBot', pattern: /\bDuckDuckBot\/([\d.]+)/i },
    { name: 'Facebook In-App Browser', pattern: /\bFBAV\/([\d.]+)/i },
    { name: 'Instagram In-App Browser', pattern: /\bInstagram[ /]([\d.]+)/i },
    { name: 'WeChat In-App Browser', pattern: /\bMicroMessenger\/([\d.]+)/i },
    { name: 'LINE In-App Browser', pattern: /\bLine\/([\d.]+)/i },
    { name: 'Electron', pattern: /\bElectron\/([\d.]+)/i },
    { name: 'Microsoft Edge', pattern: /\bEdgiOS\/([\d.]+)/i },
    { name: 'Microsoft Edge', pattern: /\bEdgA\/([\d.]+)/i },
    { name: 'Microsoft Edge', pattern: /\bEdg\/([\d.]+)/i },
    { name: 'Microsoft Edge Legacy', pattern: /\bEdge\/([\d.]+)/i },
    { name: 'Opera Mini', pattern: /\bOpera Mini\/([\d.]+)/i },
    { name: 'Opera Mobile', pattern: /\bOpera Mobi\/([\d.]+)/i },
    { name: 'Opera', pattern: /\bOPiOS\/([\d.]+)/i },
    { name: 'Opera', pattern: /\bOPR\/([\d.]+)/i },
    { name: 'Opera', pattern: /\bOpera\/[\d.]+.*\bVersion\/([\d.]+)/i },
    { name: 'Samsung Internet', pattern: /\bSamsungBrowser\/([\d.]+)/i },
    { name: 'Huawei Browser', pattern: /\bHuaweiBrowser\/([\d.]+)/i },
    { name: 'UC Browser', pattern: /\bUCBrowser\/([\d.]+)/i },
    { name: 'Yandex Browser', pattern: /\bYaBrowser\/([\d.]+)/i },
    { name: 'Vivaldi', pattern: /\bVivaldi\/([\d.]+)/i },
    { name: 'Brave', pattern: /\bBrave\/([\d.]+)/i },
    { name: 'DuckDuckGo Browser', pattern: /\bDuckDuckGo\/([\d.]+)/i },
    { name: 'Firefox Focus', pattern: /\bFocus\/([\d.]+)/i },
    { name: 'Firefox', pattern: /\bFxiOS\/([\d.]+)/i },
    { name: 'Firefox', pattern: /\bFirefox\/([\d.]+)/i },
    { name: 'Android WebView', pattern: /\bwv\).*?\bChrome\/([\d.]+)/i },
    { name: 'Chrome Headless', pattern: /\bHeadlessChrome\/([\d.]+)/i },
    { name: 'Google Chrome', pattern: /\bCriOS\/([\d.]+)/i },
    { name: 'Google Chrome', pattern: /\bChrome\/([\d.]+)/i },
    { name: 'Chromium', pattern: /\bChromium\/([\d.]+)/i },
    { name: 'Mobile Safari', pattern: /\bVersion\/([\d.]+).*?\bMobile\/\S+.*?\bSafari\//i },
    { name: 'Safari', pattern: /\bVersion\/([\d.]+).*?\bSafari\//i },
    { name: 'Internet Explorer', pattern: /\bMSIE\s+([\d.]+)/i },
    { name: 'Internet Explorer', pattern: /\bTrident\/[\d.]+.*?\brv:([\d.]+)/i },
    { name: 'Postman Runtime', pattern: /\bPostmanRuntime\/([\d.]+)/i },
    { name: 'curl', pattern: /\bcurl\/([\d.]+)/i },
    { name: 'Wget', pattern: /\bWget\/([\d.]+)/i },
    { name: 'okhttp', pattern: /\bokhttp\/([\d.]+)/i },
]

const WINDOWS_VERSIONS: Readonly<Record<string, string>> = {
    '10.0': '10/11',
    '6.4': '10',
    '6.3': '8.1',
    '6.2': '8',
    '6.1': '7',
    '6.0': 'Vista',
    '5.2': 'XP Professional x64',
    '5.1': 'XP',
    '5.0': '2000',
}

const normalizeUserAgent = (userAgent: string | null | undefined): string => {
    return String(userAgent ?? '').trim().slice(0, MAX_USER_AGENT_LENGTH)
}

const normalizeVersion = (version: string | undefined): string => {
    return (version ?? '').replaceAll('_', '.')
}

const createBrowserInfo = (name: string, version = ''): BrowserInfo => ({
    name,
    version: normalizeVersion(version),
    major: normalizeVersion(version).split('.')[0] ?? '',
})

const createEngineInfo = (name: string, version = ''): EngineInfo => ({
    name,
    version: normalizeVersion(version),
})

const createOsInfo = (name: string, version = ''): OsInfo => ({
    name,
    version: normalizeVersion(version),
})

const createDeviceInfo = (
    type: DeviceType,
    vendor = UNKNOWN,
    model = UNKNOWN,
): DeviceInfo => ({
    type,
    vendor,
    model,
})

const firstMatch = (userAgent: string, pattern: RegExp): string => {
    return normalizeVersion(userAgent.match(pattern)?.[1])
}

/**
 * Extracts the browser family and version advertised in a User-Agent string.
 * Browser brands that intentionally omit a token, such as Brave, may look like
 * the Chromium browser on which they are based.
 */
export const extractBrowser = (input: string | null | undefined): BrowserInfo => {
    const userAgent = normalizeUserAgent(input)

    if (!userAgent) return createBrowserInfo(UNKNOWN)

    for (const rule of BROWSER_RULES) {
        const match = userAgent.match(rule.pattern)
        if (match) return createBrowserInfo(rule.name, match[1])
    }

    if (/\bAppleWebKit\//i.test(userAgent) && /\bMobile\//i.test(userAgent)) {
        return createBrowserInfo('iOS WebView', firstMatch(userAgent, /\bAppleWebKit\/([\d.]+)/i))
    }

    return createBrowserInfo(UNKNOWN)
}

/**
 * Extracts the rendering engine. Blink does not expose a distinct engine
 * version, so its version is intentionally left empty.
 */
export const extractEngine = (input: string | null | undefined): EngineInfo => {
    const userAgent = normalizeUserAgent(input)

    if (!userAgent) return createEngineInfo(UNKNOWN)

    const tridentVersion = firstMatch(userAgent, /\bTrident\/([\d.]+)/i)
    if (tridentVersion) return createEngineInfo('Trident', tridentVersion)

    const edgeHtmlVersion = firstMatch(userAgent, /\bEdge\/([\d.]+)/i)
    if (edgeHtmlVersion) return createEngineInfo('EdgeHTML', edgeHtmlVersion)

    const prestoVersion = firstMatch(userAgent, /\bPresto\/([\d.]+)/i)
    if (prestoVersion) return createEngineInfo('Presto', prestoVersion)

    const goannaVersion = firstMatch(userAgent, /\bGoanna\/([\d.]+)/i)
    if (goannaVersion) return createEngineInfo('Goanna', goannaVersion)

    const webKitVersion = firstMatch(userAgent, /\bAppleWebKit\/([\d.]+)/i)
    const isIosBrowser = /\b(?:CPU (?:iPhone )?OS|iPhone OS|iPad|iPod)\b/i.test(userAgent)

    if (webKitVersion && isIosBrowser) {
        return createEngineInfo('WebKit', webKitVersion)
    }

    if (
        webKitVersion
        && /\b(?:Chrome|Chromium|HeadlessChrome|EdgA?|OPR|SamsungBrowser|Vivaldi)\//i.test(userAgent)
    ) {
        return createEngineInfo('Blink')
    }

    const geckoVersion = firstMatch(userAgent, /\brv:([\d.]+).*?\bGecko\//i)
    if (geckoVersion) return createEngineInfo('Gecko', geckoVersion)

    if (webKitVersion) return createEngineInfo('WebKit', webKitVersion)

    const khtmlVersion = firstMatch(userAgent, /\bKHTML\/([\d.]+)/i)
    if (khtmlVersion) return createEngineInfo('KHTML', khtmlVersion)

    return createEngineInfo(UNKNOWN)
}

/**
 * Extracts the operating system family and version. Windows 10 and 11 share
 * the same traditional User-Agent token, so they are reported as "10/11".
 */
export const extractOS = (input: string | null | undefined): OsInfo => {
    const userAgent = normalizeUserAgent(input)

    if (!userAgent) return createOsInfo(UNKNOWN)

    const windowsPhoneVersion = firstMatch(
        userAgent,
        /\bWindows Phone(?: OS)?\s+([\d.]+)/i,
    )
    if (windowsPhoneVersion) return createOsInfo('Windows Phone', windowsPhoneVersion)

    const windowsVersion = firstMatch(userAgent, /\bWindows NT\s+([\d.]+)/i)
    if (windowsVersion) {
        return createOsInfo('Windows', WINDOWS_VERSIONS[windowsVersion] ?? windowsVersion)
    }

    const harmonyVersion = firstMatch(userAgent, /\bHarmonyOS[ /]([\d.]+)/i)
    if (harmonyVersion) return createOsInfo('HarmonyOS', harmonyVersion)

    const androidVersion = firstMatch(userAgent, /\bAndroid[ /-]?([\d.]+)/i)
    if (androidVersion) return createOsInfo('Android', androidVersion)

    const iosVersion = firstMatch(
        userAgent,
        /\b(?:CPU (?:iPhone )?OS|iPhone OS)\s+([\d_]+)/i,
    )
    if (iosVersion) return createOsInfo('iOS', iosVersion)

    const watchVersion = firstMatch(userAgent, /\bWatch OS\s+([\d_]+)/i)
    if (watchVersion) return createOsInfo('watchOS', watchVersion)

    const tvVersion = firstMatch(userAgent, /\b(?:CPU )?OS\s+([\d_]+).*?\bAppleTV/i)
    if (tvVersion) return createOsInfo('tvOS', tvVersion)

    const macVersion = firstMatch(userAgent, /\bMac OS X\s+([\d_]+)/i)
    if (macVersion) return createOsInfo('macOS', macVersion)

    const chromeOsVersion = firstMatch(userAgent, /\bCrOS\s+\S+\s+([\d.]+)/i)
    if (chromeOsVersion) return createOsInfo('Chrome OS', chromeOsVersion)

    const tizenVersion = firstMatch(userAgent, /\bTizen[ /]([\d.]+)/i)
    if (tizenVersion) return createOsInfo('Tizen', tizenVersion)

    const webOsVersion = firstMatch(userAgent, /\b(?:webOS|hpwOS)[ /]([\d.]+)/i)
    if (webOsVersion) return createOsInfo('webOS', webOsVersion)

    const kaiOsVersion = firstMatch(userAgent, /\bKaiOS\/([\d.]+)/i)
    if (kaiOsVersion) return createOsInfo('KaiOS', kaiOsVersion)

    const blackberryVersion = firstMatch(userAgent, /\bBB10;\s*Touch.*?\bVersion\/([\d.]+)/i) || firstMatch(userAgent, /\bBlackBerry\w*\/([\d.]+)/i)
    if (blackberryVersion) return createOsInfo('BlackBerry OS', blackberryVersion)

    if (/\bUbuntu\b/i.test(userAgent)) return createOsInfo('Ubuntu')
    if (/\bFedora\b/i.test(userAgent)) return createOsInfo('Fedora')
    if (/\bDebian\b/i.test(userAgent)) return createOsInfo('Debian')
    if (/\bFreeBSD\b/i.test(userAgent)) return createOsInfo('FreeBSD')
    if (/\bOpenBSD\b/i.test(userAgent)) return createOsInfo('OpenBSD')
    if (/\bFuchsia\b/i.test(userAgent)) return createOsInfo('Fuchsia')
    if (/\bLinux\b/i.test(userAgent)) return createOsInfo('Linux')

    return createOsInfo(UNKNOWN)
}

const extractAndroidModel = (userAgent: string): string => {
    const androidBlock = userAgent.match(/\(([^)]*\bAndroid\b[^)]*)\)/i)?.[1]
    if (!androidBlock) return UNKNOWN

    const parts = androidBlock.split(';').map((part) => part.trim())
    const androidIndex = parts.findIndex((part) => /\bAndroid\b/i.test(part))
    if (androidIndex < 0) return UNKNOWN

    for (const part of parts.slice(androidIndex + 1)) {
        const model = part.replace(/\s+Build\/.*$/i, '').trim()

        if (!model) continue
        if (/^(?:[a-z]{2}(?:[-_][a-z]{2})?|mobile|tablet|u|wv|k)$/i.test(model)) continue
        if (/^(?:arm|arm64|aarch64|x86|x86_64)$/i.test(model)) continue

        return model
    }

    return UNKNOWN
}

const inferAndroidVendor = (model: string, userAgent: string): string => {
    const source = `${model} ${userAgent}`

    if (/\b(?:Pixel|Nexus)\b/i.test(source)) return 'Google'
    if (/\b(?:Samsung|SM-|GT-|SCH-|SGH-)/i.test(source)) return 'Samsung'
    if (/\b(?:Kindle|KF[A-Z0-9]+|Silk)\b/i.test(source)) return 'Amazon'
    if (/\b(?:Huawei|HUAWEI|Honor)\b/i.test(source)) return 'Huawei'
    if (/\b(?:Xiaomi|Redmi|POCO|Mi\s|MIX\s)/i.test(source)) return 'Xiaomi'
    if (/\bOnePlus\b/i.test(source)) return 'OnePlus'
    if (/\b(?:OPPO|CPH\d+)/i.test(source)) return 'OPPO'
    if (/\b(?:vivo|V\d{4}[A-Z]?)\b/i.test(source)) return 'vivo'
    if (/\b(?:Motorola|moto\s|XT\d+)/i.test(source)) return 'Motorola'
    if (/\b(?:Sony|Xperia)\b/i.test(source)) return 'Sony'
    if (/\b(?:LG-|LGE)\b/i.test(source)) return 'LG'
    if (/\bNokia\b/i.test(source)) return 'Nokia'
    if (/\bASUS\b/i.test(source)) return 'ASUS'
    if (/\bLenovo\b/i.test(source)) return 'Lenovo'
    if (/\bZTE\b/i.test(source)) return 'ZTE'
    if (/\bHTC\b/i.test(source)) return 'HTC'

    return UNKNOWN
}

const extractWindowsPhoneDevice = (userAgent: string): DeviceInfo => {
    const match = userAgent.match(/\b(Microsoft|Nokia);\s*(Lumia[^;)]+)/i)
    if (!match) return createDeviceInfo('mobile', 'Microsoft')

    const vendor = match[1]?.toLowerCase() === 'nokia' ? 'Nokia' : 'Microsoft'
    return createDeviceInfo('mobile', vendor, match[2]?.trim() || UNKNOWN)
}

/**
 * Extracts a broad device type plus vendor/model when those tokens are present.
 * Reduced User-Agent strings commonly hide the exact device model.
 */
export const extractDevice = (input: string | null | undefined): DeviceInfo => {
    const userAgent = normalizeUserAgent(input)

    if (!userAgent) return createDeviceInfo('unknown')

    if (/\b(?:bot|crawler|spider|slurp|Google-InspectionTool)\b/i.test(userAgent)) {
        return createDeviceInfo('bot')
    }

    if (/\bWindows Phone\b/i.test(userAgent)) {
        return extractWindowsPhoneDevice(userAgent)
    }

    const fireTvModel = userAgent.match(/\b(AFT[A-Z0-9]+)\b/i)?.[1]
    if (fireTvModel) return createDeviceInfo('smarttv', 'Amazon', fireTvModel)

    if (/\bAppleTV\b/i.test(userAgent)) return createDeviceInfo('smarttv', 'Apple', 'Apple TV')
    if (/\b(?:SMART-TV|SmartTV|HbbTV|NetCast|BRAVIA|Viera|Tizen.+TV|webOS.+TV)\b/i.test(userAgent)) {
        const vendor = /\bSamsung\b/i.test(userAgent)
            ? 'Samsung'
            : /\b(?:LG|webOS|NetCast)\b/i.test(userAgent)
                ? 'LG'
                : /\bBRAVIA\b/i.test(userAgent)
                    ? 'Sony'
                    : UNKNOWN
        return createDeviceInfo('smarttv', vendor)
    }

    const playStationModel = userAgent.match(/\b(PlayStation (?:Vita|[345]))\b/i)?.[1]
    if (playStationModel) return createDeviceInfo('console', 'Sony', playStationModel)

    const xboxModel = userAgent.match(/\b(Xbox(?: One| Series [SX])?)\b/i)?.[1]
    if (xboxModel) return createDeviceInfo('console', 'Microsoft', xboxModel)

    const nintendoModel = userAgent.match(/\b(Nintendo (?:Switch|WiiU?|3DS))\b/i)?.[1]
    if (nintendoModel) return createDeviceInfo('console', 'Nintendo', nintendoModel)

    if (/\b(?:AppleWatch|Watch OS)\b/i.test(userAgent)) {
        return createDeviceInfo('wearable', 'Apple', 'Apple Watch')
    }

    if (/\b(?:Wear OS|Android Wear)\b/i.test(userAgent)) {
        return createDeviceInfo('wearable')
    }

    if (/\biPad\b/i.test(userAgent)) return createDeviceInfo('tablet', 'Apple', 'iPad')
    if (/\biPod\b/i.test(userAgent)) return createDeviceInfo('mobile', 'Apple', 'iPod')
    if (/\biPhone\b/i.test(userAgent)) return createDeviceInfo('mobile', 'Apple', 'iPhone')

    const kindleModel = userAgent.match(/\b(KF[A-Z0-9]+|Kindle)\b/i)?.[1]
    if (kindleModel || /\bSilk\//i.test(userAgent)) {
        return createDeviceInfo('tablet', 'Amazon', kindleModel ?? UNKNOWN)
    }

    if (/\bAndroid\b/i.test(userAgent)) {
        const model = extractAndroidModel(userAgent)
        const vendor = inferAndroidVendor(model, userAgent)
        const type: DeviceType = /\bMobile\b/i.test(userAgent) ? 'mobile' : 'tablet'
        return createDeviceInfo(type, vendor, model)
    }

    if (/\b(?:Raspberry Pi|ESP32)\b/i.test(userAgent)) {
        const model = userAgent.match(/\b(Raspberry Pi|ESP32)\b/i)?.[1] ?? UNKNOWN
        return createDeviceInfo('embedded', UNKNOWN, model)
    }

    if (/\b(?:Tablet|PlayBook)\b/i.test(userAgent)) return createDeviceInfo('tablet')
    if (/\b(?:Mobile|BB10|BlackBerry)\b/i.test(userAgent)) return createDeviceInfo('mobile')

    if (/\b(?:Windows NT|Macintosh|X11|Linux|CrOS)\b/i.test(userAgent)) {
        const vendor = /\bMacintosh\b/i.test(userAgent) ? 'Apple' : UNKNOWN
        return createDeviceInfo('desktop', vendor)
    }

    return createDeviceInfo('unknown')
}

/**
 * Extracts the CPU architecture explicitly advertised by the User-Agent. It
 * does not guess hidden physical hardware, such as Apple Silicon when a browser
 * reports an Intel-compatible Macintosh token.
 */
export const extractCPU = (input: string | null | undefined): CpuInfo => {
    const userAgent = normalizeUserAgent(input)

    if (/\b(?:arm64|aarch64|armv8(?:l)?)\b/i.test(userAgent)) {
        return { architecture: 'arm64' }
    }
    if (/\b(?:armv[5-7](?:l)?|armhf|arm)\b/i.test(userAgent)) {
        return { architecture: 'arm' }
    }
    if (/\b(?:x86_64|x64|Win64|WOW64|amd64)\b/i.test(userAgent)) {
        return { architecture: 'amd64' }
    }
    if (/\b(?:i[3-6]86|x86)\b/i.test(userAgent)) {
        return { architecture: 'ia32' }
    }
    if (/\bia64\b/i.test(userAgent)) return { architecture: 'ia64' }
    if (/\b(?:ppc64|powerpc64)\b/i.test(userAgent)) return { architecture: 'ppc64' }
    if (/\b(?:ppc|powerpc)\b/i.test(userAgent)) return { architecture: 'ppc' }
    if (/\bmips64\b/i.test(userAgent)) return { architecture: 'mips64' }
    if (/\bmips\b/i.test(userAgent)) return { architecture: 'mips' }
    if (/\bsparc\b/i.test(userAgent)) return { architecture: 'sparc' }
    if (/\briscv64\b/i.test(userAgent)) return { architecture: 'riscv64' }
    if (/\bloongarch64\b|\bloong64\b/i.test(userAgent)) return { architecture: 'loong64' }

    return { architecture: 'unknown' }
}

/**
 * Parses all supported User-Agent fields in one call.
 */
export const extractUserAgent = (input: string | null | undefined): UserAgentInfo => {
    const userAgent = normalizeUserAgent(input)

    return {
        userAgent,
        browser: extractBrowser(userAgent),
        engine: extractEngine(userAgent),
        os: extractOS(userAgent),
        device: extractDevice(userAgent),
        cpu: extractCPU(userAgent),
    }
}

export const extractUA = extractUserAgent

export default extractUserAgent
