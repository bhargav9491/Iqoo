import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const procedures = await prisma.procedure.findMany({
      where: { projectId: id },
      include: {
        steps: {
          include: {
            observations: {
              orderBy: { createdAt: 'desc' },
            },
          },
          orderBy: { stepOrder: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ procedures });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch procedures.' },
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
    const { title, description, category, steps } = await req.json();

    if (!title || !steps || !Array.isArray(steps) || steps.length === 0) {
      return NextResponse.json(
        { error: 'Title and at least one step are required.' },
        { status: 400 }
      );
    }

    const procedure = await prisma.procedure.create({
      data: {
        projectId: id,
        title,
        description: description || '',
        category: category || 'DEPLOYMENT',
        status: 'IN_REVIEW',
        steps: {
          create: steps.map((s: any, idx: number) => ({
            stepOrder: s.stepOrder || idx + 1,
            title: s.title,
            expectedAction: s.expectedAction,
            evidenceRequired: Boolean(s.evidenceRequired),
            reviewStatus: 'PENDING',
          })),
        },
      },
      include: {
        steps: true,
      },
    });

    // Log Activity
    await prisma.activityEvent.create({
      data: {
        projectId: id,
        userId: user?.id,
        type: 'PROCEDURE_CHECKED',
        title: `Procedure Created: ${title}`,
        description: `Defined procedure with ${steps.length} ordered steps.`,
      },
    });

    return NextResponse.json({ procedure }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating procedure:', error);
    return NextResponse.json(
      { error: 'Failed to create procedure.' },
      { status: 500 }
    );
  }
}
