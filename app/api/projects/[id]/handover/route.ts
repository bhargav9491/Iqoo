import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { AIEngine } from '@/lib/ai-engine';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const handovers = await prisma.handover.findMany({
      where: { projectId: id },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = handovers.map((h) => ({
      ...h,
      completedWork: JSON.parse(h.completedWork || '[]'),
      pendingWork: JSON.parse(h.pendingWork || '[]'),
      blockers: JSON.parse(h.blockers || '[]'),
      keyDecisions: JSON.parse(h.keyDecisions || '[]'),
      failedApproaches: JSON.parse(h.failedApproaches || '[]'),
      recommendedNextSteps: JSON.parse(h.recommendedNextSteps || '[]'),
      verificationChecklist: JSON.parse(h.verificationChecklist || '[]'),
    }));

    return NextResponse.json({ handovers: formatted });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch handovers.' },
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

    // Retrieve project with complete related context
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        workContexts: true,
        tasks: true,
        decisions: true,
        procedures: {
          include: {
            steps: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    // Generate grounded Handover using AI Engine
    const generated = AIEngine.generateHandover(project);

    // Save Handover entity to database
    const savedHandover = await prisma.handover.create({
      data: {
        projectId: id,
        title: generated.title,
        executiveSummary: generated.executiveSummary,
        completedWork: JSON.stringify(generated.completedWork),
        pendingWork: JSON.stringify(generated.pendingWork),
        blockers: JSON.stringify(generated.blockers),
        keyDecisions: JSON.stringify(generated.keyDecisions),
        failedApproaches: JSON.stringify(generated.failedApproaches),
        recommendedNextSteps: JSON.stringify(generated.recommendedNextSteps),
        verificationChecklist: JSON.stringify(generated.verificationChecklist),
      },
    });

    // Update project status to HANDOVER_READY if ACTIVE
    await prisma.project.update({
      where: { id },
      data: {
        status: 'HANDOVER_READY',
        updatedAt: new Date(),
      },
    });

    // Log Activity
    await prisma.activityEvent.create({
      data: {
        projectId: id,
        userId: user?.id,
        type: 'HANDOVER_GENERATED',
        title: 'Project Handover Generated',
        description: `Generated structured handover brief with ${generated.recommendedNextSteps.length} recommended next steps.`,
      },
    });

    return NextResponse.json({
      handover: {
        ...savedHandover,
        completedWork: generated.completedWork,
        pendingWork: generated.pendingWork,
        blockers: generated.blockers,
        keyDecisions: generated.keyDecisions,
        failedApproaches: generated.failedApproaches,
        recommendedNextSteps: generated.recommendedNextSteps,
        verificationChecklist: generated.verificationChecklist,
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error generating handover:', error);
    return NextResponse.json(
      { error: 'Failed to generate project handover.' },
      { status: 500 }
    );
  }
}
