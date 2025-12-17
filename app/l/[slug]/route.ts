import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Function to get geolocation data from IP address
async function getGeolocationFromIP(ipAddress: string) {
  try {
    // Skip geolocation for localhost or private IPs
    if (ipAddress === "unknown" || ipAddress.startsWith("127.") || ipAddress.startsWith("192.168.") || ipAddress.startsWith("10.")) {
      return { country: null, city: null };
    }

    // Use ip-api.com free service (45 requests per minute limit)
    const response = await fetch(`http://ip-api.com/json/${ipAddress}?fields=status,country,city`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      return { country: null, city: null };
    }

    const data = await response.json();
    
    if (data.status === "success") {
      return {
        country: data.country || null,
        city: data.city || null,
      };
    }

    return { country: null, city: null };
  } catch (error) {
    console.error("Error fetching geolocation:", error);
    return { country: null, city: null };
  }
}

// Function to detect device type from user agent
function detectDevice(userAgent: string): string | null {
  if (!userAgent || userAgent === "unknown") return null;
  
  const ua = userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return "mobile";
  }
  return "desktop";
}

// Function to detect browser from user agent
function detectBrowser(userAgent: string): string | null {
  if (!userAgent || userAgent === "unknown") return null;
  
  const ua = userAgent.toLowerCase();
  if (ua.includes("chrome") && !ua.includes("edg")) return "Chrome";
  if (ua.includes("firefox")) return "Firefox";
  if (ua.includes("safari") && !ua.includes("chrome")) return "Safari";
  if (ua.includes("edg")) return "Edge";
  if (ua.includes("opera") || ua.includes("opr")) return "Opera";
  return "Unknown";
}

// GET - Redirect to original URL and track click
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    // Find the affiliate link by shortUrl with productUrls
    const link = await prisma.affiliateLink.findUnique({
      where: { shortUrl: slug },
      include: {
        productUrls: {
          include: {
            ecommerceBrand: true,
          },
          orderBy: [
            { isPrimary: 'desc' },
            { order: 'asc' },
          ],
        },
      },
    });

    if (!link || !link.isActive) {
      return NextResponse.json(
        { error: "Link not found or inactive" },
        { status: 404 }
      );
    }

    // Get redirect URL from productUrls (primary first) or fallback to originalUrl
    let redirectUrl: string | null = null;
    if (link.productUrls && link.productUrls.length > 0) {
      const primaryUrl = link.productUrls.find(pu => pu.isPrimary) || link.productUrls[0];
      redirectUrl = primaryUrl.url;
    } else if (link.originalUrl) {
      redirectUrl = link.originalUrl;
    }

    if (!redirectUrl) {
      return NextResponse.json(
        { error: "No redirect URL found for this link" },
        { status: 404 }
      );
    }

    // Get client IP address
    const forwarded = request.headers.get("x-forwarded-for");
    const ipAddress = forwarded
      ? forwarded.split(",")[0].trim()
      : request.headers.get("x-real-ip") || "unknown";

    // Get user agent
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Get referrer
    const referrer = request.headers.get("referer") || request.headers.get("referrer") || null;

    // Get geolocation data
    const { country, city } = await getGeolocationFromIP(ipAddress);

    // Detect device and browser
    const device = detectDevice(userAgent);
    const browser = detectBrowser(userAgent);

    // Create click record (async, don't wait for it)
    prisma.click
      .create({
        data: {
          linkId: link.id,
          ipAddress,
          userAgent,
          referrer,
          country,
          city,
          device,
          browser,
        },
      })
      .catch((error) => {
        console.error("Error creating click record:", error);
      });

    // Increment click count (async, don't wait for it)
    prisma.affiliateLink
      .update({
        where: { id: link.id },
        data: { clickCount: { increment: 1 } },
      })
      .catch((error) => {
        console.error("Error incrementing click count:", error);
      });

    // Redirect to product URL
    return NextResponse.redirect(redirectUrl, { status: 302 });
  } catch (error: any) {
    console.error("Error processing redirect:", error);
    return NextResponse.json(
      { error: "Failed to process redirect", details: error.message },
      { status: 500 }
    );
  }
}


