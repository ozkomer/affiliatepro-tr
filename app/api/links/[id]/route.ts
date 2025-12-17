import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    console.log('Fetching link with id:', id);
    
    // Try to find by shortUrl first (for public access)
    let link = await prisma.affiliateLink.findUnique({
      where: { shortUrl: id },
      include: {
        ecommerceBrand: {
          select: {
            id: true,
            name: true,
            logo: true,
            color: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        productUrls: {
          include: {
            ecommerceBrand: {
              select: {
                id: true,
                name: true,
                logo: true,
                color: true,
              },
            },
          },
          orderBy: [
            { isPrimary: 'desc' },
            { order: 'asc' },
          ],
        },
      },
    });

    // If not found by shortUrl, try by id
    if (!link) {
      link = await prisma.affiliateLink.findUnique({
        where: { id },
        include: {
          ecommerceBrand: {
            select: {
              id: true,
              name: true,
              logo: true,
              color: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          productUrls: {
            include: {
              ecommerceBrand: {
                select: {
                  id: true,
                  name: true,
                  logo: true,
                  color: true,
                },
              },
            },
            orderBy: [
              { isPrimary: 'desc' },
              { order: 'asc' },
            ],
          },
        },
      });
    }

    if (!link) {
      console.log('Link not found for id/shortUrl:', id);
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    console.log('Found link:', link.title);
    return NextResponse.json(link);
  } catch (error: any) {
    console.error('Error fetching link:', error);
    return NextResponse.json(
      { error: 'Failed to fetch link', details: error.message },
      { status: 500 }
    );
  }
}

