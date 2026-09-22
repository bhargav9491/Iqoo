import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const user = await getAuthenticatedUser(req);
    const { title, description, priority, assignee, status } = await req.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required.' }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        projectId: id,
        title,
        description: description || '',
        priority: priority || 'MEDIUM',
        status: status || 'PENDING',
        assignee: assignee || user?.name || 'Engineer',
      },
    });

    // Update project updatedAt
    await prisma.project.update({
      where: { id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create task.' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: projectId } = params;
    const user = await getAuthenticatedUser(req);
    const { taskId, status, priority, title } = await req.json();

    if (!taskId) {
      return NextResponse.json({ error: 'TaskId is required.' }, { status: 400 });
    }

    const updateData: any = {};
    if (status !== undefined) {
      updateData.status = status;
      if (status === 'COMPLETED') {
        updateData.completedAt = new Date();
      }
    }
    if (priority !== undefined) updateData.priority = priority;
    if (title !== undefined) updateData.title = title;

    const task = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });

    if (status === 'COMPLETED') {
      await prisma.activityEvent.create({
        data: {
          projectId,
          userId: user?.id,
          type: 'TASK_COMPLETED',
          title: `Task Completed: ${task.title}`,
          description: `Marked completed by ${user?.name || 'Engineer'}.`,
        },
      });
    }

    return NextResponse.json({ task });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update task.' }, { status: 500 });
  }
}
