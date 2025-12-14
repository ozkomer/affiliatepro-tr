import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    console.log('Fetching lists for categoryId:', categoryId);

    const where: any = {};
    if (categoryId) {
      where.categoryId = categoryId;
    }

    console.log('Prisma query where:', JSON.stringify(where));

    const lists = await prisma.curatedList.findMany({
      where,
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
              select: {
                id: true,
                title: true,
                imageUrl: true,
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
          take: 100, // Limit to prevent large responses
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log('Found lists count:', lists.length);

    // Format response
    const formattedLists = lists.map((list: any) => ({
      id: list.id,
      title: list.title,
      slug: list.slug,
      description: list.description,
      coverImage: list.coverImage,
      youtubeUrl: list.youtubeUrl,
      isFeatured: list.isFeatured,
      categoryId: list.categoryId,
      category: list.category,
      links: list.links.map((linkItem: any) => ({
        id: linkItem.id,
        link: linkItem.link,
      })),
      createdAt: list.createdAt,
      updatedAt: list.updatedAt,
    }));

    console.log('Returning formatted lists:', formattedLists.length);
    return NextResponse.json(formattedLists);
  } catch (error: any) {
    console.error('Error fetching lists:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    
    // Check if it's a Prisma error
    if (error.code) {
      console.error('Prisma error code:', error.code);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch lists', 
        details: error.message || 'Unknown error',
        code: error.code || undefined,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

