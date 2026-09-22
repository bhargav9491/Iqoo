import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const decisions = await prisma.decision.findMany({
      where: { projectId: id },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = decisions.map((d) => ({
      ...d,
      optionsConsidered: JSON.parse(d.optionsConsidered || '[]'),
    }));

    return NextResponse.json({ decisions: formatted });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch decisions.' },
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
    const { title, context, optionsConsidered, selectedOption, reasoning, expectedImpact, status } = await req.json();

    if (!title || !context || !selectedOption || !reasoning) {
      return NextResponse.json(
        { error: 'Title, context, selected option, and reasoning are required.' },
        { status: 400 }
      );
    }

    const decision = await prisma.decision.create({
      data: {
        projectId: id,
        title,
        context,
        optionsConsidered: JSON.stringify(Array.isArray(optionsConsidered) ? optionsConsidered : [optionsConsidered]),
        selectedOption,
        reasoning,
        expectedImpact: expectedImpact || '',
        status: status || 'ACCEPTED',
        author: user?.name || 'Lead Architect',
      },
    });

    // Update project timestamp
    await prisma.project.update({
      where: { id },
      data: { updatedAt: new Date() },
    });

    // Log Activity Event
    await prisma.activityEvent.create({
      data: {
        projectId: id,
        userId: user?.id,
        type: 'DECISION_RECORDED',
        title: `Architectural Decision Recorded: ${title}`,
        description: `Selected: ${selectedOption}. Rationale: ${reasoning.slice(0, 100)}...`,
      },
    });

    return NextResponse.json({
      decision: {
        ...decision,
        optionsConsidered: JSON.parse(decision.optionsConsidered),
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating decision:', error);
    return NextResponse.json(
      { error: 'Failed to record decision.' },
      { status: 500 }
    );
  }
}
