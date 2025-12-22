import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
  return "Other";
}

// POST - Track list click
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { listUrlId } = body;

    console.log('Tracking list click for slug:', slug, 'listUrlId:', listUrlId);

    // Find list by slug or shortUrl
    let list = await prisma.curatedList.findUnique({
      where: { slug },
      select: { id: true, clickCount: true },
    });

    if (!list) {
      console.log('List not found by slug, trying shortUrl:', slug);
      list = await prisma.curatedList.findUnique({
        where: { shortUrl: slug },
        select: { id: true, clickCount: true },
      });
    }

    if (!list) {
      console.error('List not found for slug/shortUrl:', slug);
      return NextResponse.json(
        { error: "List not found", slug },
        { status: 404 }
      );
    }

    const listId = list.id;
    console.log('Found list:', listId, 'current clickCount:', list.clickCount);

    // Get client IP address
    const forwarded = request.headers.get("x-forwarded-for");
    const ipAddress = forwarded
      ? forwarded.split(",")[0].trim()
      : request.headers.get("x-real-ip") || "unknown";

    // Get user agent
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Get referrer
    const referrer = request.headers.get("referer") || request.headers.get("referrer") || null;

    // Get geolocation data (async, but don't wait for it to redirect)
    const geolocationPromise = getGeolocationFromIP(ipAddress);
    const device = detectDevice(userAgent);
    const browser = detectBrowser(userAgent);

    // Get geolocation data
    const { country, city } = await geolocationPromise;

    // Create click record (async, don't wait for it)
    prisma.listClick
      .create({
        data: {
          listId: listId,
          listUrlId: listUrlId || null,
          ipAddress,
          userAgent,
          referrer,
          country,
          city,
          device,
          browser,
          converted: false,
        },
      })
      .then(() => {
        console.log('ListClick record created successfully');
      })
      .catch((error) => {
        console.error("Error creating list click record:", error);
      });

    // Update list click count
    try {
      const updated = await prisma.curatedList.update({
        where: { id: listId },
        data: {
          clickCount: {
            increment: 1,
          },
        },
        select: { clickCount: true },
      });
      console.log('Click count updated successfully. New count:', updated.clickCount);
    } catch (updateError) {
      console.error("Error updating click count:", updateError);
      // Don't fail the request if click count update fails
    }

    return NextResponse.json({ success: true, listId });
  } catch (error: any) {
    console.error("Error tracking list click:", error);
    return NextResponse.json(
      { error: "Failed to track click", details: error.message },
      { status: 500 }
    );
  }
}

