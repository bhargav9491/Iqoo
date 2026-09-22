import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { seedDemoData } from '@/lib/seed-data';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    // If no projects exist in database yet, auto-seed default demo project
    const count = await prisma.project.count();
    if (count === 0) {
      await seedDemoData();
    }

    let whereClause = {};
    if (user) {
      whereClause = {};
    }

    const projects = await prisma.project.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            workContexts: true,
            tasks: true,
            decisions: true,
            procedures: true,
            handovers: true,
          },
        },
        tasks: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const formatted = projects.map((p) => {
      const totalTasks = p.tasks.length;
      const completedTasks = p.tasks.filter((t) => t.status === 'COMPLETED').length;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      let team: string[] = [];
      try {
        team = JSON.parse(p.teamMembers);
      } catch {
        team = ['Alex Chen', 'Sarah Lin'];
      }

      return {
        ...p,
        teamMembers: team,
        progress,
      };
    });

    return NextResponse.json({ projects: formatted });
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthenticatedUser(req);
    const { name, description, objective, priority, teamMembers } = await req.json();

    if (!name || !objective) {
      return NextResponse.json(
        { error: 'Project name and objective are required.' },
        { status: 400 }
      );
    }

    let userId = user?.id;
    if (!userId) {
      const firstUser = await prisma.user.findFirst();
      userId = firstUser ? firstUser.id : (await seedDemoData()).userId;
    }

    const project = await prisma.project.create({
      data: {
        name,
        description: description || '',
        objective,
        priority: priority || 'HIGH',
        status: 'ACTIVE',
        teamMembers: JSON.stringify(Array.isArray(teamMembers) ? teamMembers : ['Lead Engineer']),
        userId: userId!,
      },
    });

    await prisma.activityEvent.create({
      data: {
        projectId: project.id,
        userId: userId!,
        type: 'PROJECT_CREATED',
        title: 'Project Created',
        description: `Project "${project.name}" was created.`,
      },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project.' },
      { status: 500 }
    );
  }
}
