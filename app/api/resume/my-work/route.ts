import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { seedDemoData } from '@/lib/seed-data';
import { AIEngine } from '@/lib/ai-engine';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    
    // Ensure at least one demo project exists
    const projectCount = await prisma.project.count();
    if (projectCount === 0) {
      await seedDemoData();
    }

    // Get the most recently active or updated project
    const latestProject = await prisma.project.findFirst({
      where: { status: { not: 'COMPLETED' } },
      include: {
        workContexts: { orderBy: { createdAt: 'desc' }, take: 5 },
        tasks: { orderBy: { createdAt: 'desc' } },
        decisions: { orderBy: { createdAt: 'desc' }, take: 4 },
        procedures: { include: { steps: true }, take: 2 },
        activities: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
      orderBy: { updatedAt: 'desc' },
    });

    if (!latestProject) {
      return NextResponse.json({ resumeState: null });
    }

    // Synthesize structured resume state
    const analysis = AIEngine.analyzeResumeState(latestProject);

    const formattedProject = {
      id: latestProject.id,
      name: latestProject.name,
      objective: latestProject.objective,
      status: latestProject.status,
      priority: latestProject.priority,
      updatedAt: latestProject.updatedAt,
      recentActivities: latestProject.activities,
      tasks: latestProject.tasks,
      decisions: latestProject.decisions.map((d) => ({
        ...d,
        optionsConsidered: JSON.parse(d.optionsConsidered || '[]'),
      })),
      workContexts: latestProject.workContexts.map((c) => ({
        ...c,
        tags: JSON.parse(c.tags || '[]'),
      })),
    };

    return NextResponse.json({
      project: formattedProject,
      resumeState: analysis,
    });
  } catch (error: any) {
    console.error('Error fetching resume state:', error);
    return NextResponse.json(
      { error: 'Failed to generate resume state.' },
      { status: 500 }
    );
  }
}
