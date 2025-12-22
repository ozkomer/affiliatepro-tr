import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    console.log('Fetching list with slug/shortUrl:', slug);
    
    // Try to find by slug first
    let list = await prisma.curatedList.findUnique({
      where: { slug },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        links: {
          include: {
            link: {
              include: {
                ecommerceBrand: {
                  select: {
                    id: true,
                    name: true,
                    logo: true,
                    color: true,
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
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
        listUrls: {
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

    // If not found by slug, try to find by shortUrl
    if (!list) {
      console.log('List not found with slug, trying shortUrl:', slug);
      list = await prisma.curatedList.findUnique({
        where: { shortUrl: slug },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          links: {
            include: {
              link: {
                include: {
                  ecommerceBrand: {
                    select: {
                      id: true,
                      name: true,
                      logo: true,
                      color: true,
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
              },
            },
            orderBy: {
              order: 'asc',
            },
          },
          listUrls: {
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

    if (!list) {
      console.log('List not found for slug/shortUrl:', slug);
      // Try to find all lists to see what slugs/shortUrls exist
      const allLists = await prisma.curatedList.findMany({
        select: { slug: true, shortUrl: true, title: true },
        take: 10,
      });
      console.log('Available lists (first 10):', allLists);
      
      return NextResponse.json(
        { error: 'List not found', slug, availableSlugs: allLists.map(l => ({ slug: l.slug, shortUrl: l.shortUrl, title: l.title })) },
        { status: 404 }
      );
    }

    console.log('Found list:', list.title);
    return NextResponse.json(list);
  } catch (error: any) {
    console.error('Error fetching list:', error);
    return NextResponse.json(
      { error: 'Failed to fetch list', details: error.message },
      { status: 500 }
    );
  }
}

