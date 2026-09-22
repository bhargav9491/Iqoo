import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const contexts = await prisma.workContext.findMany({
      where: { projectId: id },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = contexts.map((c) => ({
      ...c,
      tags: JSON.parse(c.tags || '[]'),
      files: JSON.parse(c.files || '[]'),
    }));

    return NextResponse.json({ contexts: formatted });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch work contexts.' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const user = await getAuthenticatedUser(req);
    const { category, title, content, tags, files } = await req.json();

    if (!category || !title || !content) {
      return NextResponse.json(
        { error: 'Category, title, and content are required.' },
        { status: 400 }
      );
    }

    const context = await prisma.workContext.create({
      data: {
        projectId: id,
        category,
        title,
        content,
        tags: JSON.stringify(Array.isArray(tags) ? tags : []),
        files: JSON.stringify(Array.isArray(files) ? files : []),
        author: user?.name || 'Lead Engineer',
      },
    });

    // Update project updatedAt
    await prisma.project.update({
      where: { id },
      data: { updatedAt: new Date() },
    });

    // Log Activity Event
    await prisma.activityEvent.create({
      data: {
        projectId: id,
        userId: user?.id,
        type: 'CONTEXT_ADDED',
        title: `Added Work Context: ${title}`,
        description: `Category: ${category}. ${content.slice(0, 100)}...`,
      },
    });

    return NextResponse.json({
      context: {
        ...context,
        tags: JSON.parse(context.tags),
        files: JSON.parse(context.files),
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating context:', error);
    return NextResponse.json(
      { error: 'Failed to record work context.' },
      { status: 500 }
    );
  }
}
