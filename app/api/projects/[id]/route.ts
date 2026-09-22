import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        workContexts: {
          orderBy: { createdAt: 'desc' },
        },
        tasks: {
          orderBy: { createdAt: 'desc' },
        },
        decisions: {
          orderBy: { createdAt: 'desc' },
        },
        procedures: {
          include: {
            steps: {
              include: {
                observations: true,
              },
              orderBy: { stepOrder: 'asc' },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        handovers: {
          orderBy: { createdAt: 'desc' },
        },
        activities: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found.' },
        { status: 404 }
      );
    }

    // Format JSON fields
    let teamMembers: string[] = [];
    try {
      teamMembers = JSON.parse(project.teamMembers);
    } catch {
      teamMembers = [];
    }

    const workContexts = project.workContexts.map((c) => ({
      ...c,
      tags: JSON.parse(c.tags || '[]'),
      files: JSON.parse(c.files || '[]'),
    }));

    const decisions = project.decisions.map((d) => ({
      ...d,
      optionsConsidered: JSON.parse(d.optionsConsidered || '[]'),
    }));

    const handovers = project.handovers.map((h) => ({
      ...h,
      completedWork: JSON.parse(h.completedWork || '[]'),
      pendingWork: JSON.parse(h.pendingWork || '[]'),
      blockers: JSON.parse(h.blockers || '[]'),
      keyDecisions: JSON.parse(h.keyDecisions || '[]'),
      failedApproaches: JSON.parse(h.failedApproaches || '[]'),
      recommendedNextSteps: JSON.parse(h.recommendedNextSteps || '[]'),
      verificationChecklist: JSON.parse(h.verificationChecklist || '[]'),
    }));

    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter((t) => t.status === 'COMPLETED').length;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return NextResponse.json({
      project: {
        ...project,
        teamMembers,
        workContexts,
        decisions,
        handovers,
        progress,
      },
    });
  } catch (error: any) {
    console.error('Error getting project:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve project details.' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();

    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.objective !== undefined) updateData.objective = body.objective;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.teamMembers !== undefined) {
      updateData.teamMembers = JSON.stringify(body.teamMembers);
    }

    const updated = await prisma.project.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ project: updated });
  } catch (error: any) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Project deleted successfully.' });
  } catch (error: any) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project.' },
      { status: 500 }
    );
  }
}
