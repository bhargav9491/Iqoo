import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AIEngine } from '@/lib/ai-engine';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { question } = await req.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question string is required.' },
        { status: 400 }
      );
    }

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        workContexts: true,
        decisions: true,
        tasks: true,
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

    // Grounded deterministic QA with explicit citation tracking
    const result = AIEngine.answerQuestion(project, question);

    // Save query log
    const queryLog = await prisma.assistantQuery.create({
      data: {
        projectId: id,
        question,
        answer: result.answer,
        citations: JSON.stringify(result.citations),
        missingContextNotes: result.missingContextNotes,
      },
    });

    return NextResponse.json({
      id: queryLog.id,
      question,
      answer: result.answer,
      citations: result.citations,
      missingContextNotes: result.missingContextNotes,
      confidenceScore: result.confidenceScore,
      createdAt: queryLog.createdAt,
    });
  } catch (error: any) {
    console.error('Error answering question:', error);
    return NextResponse.json(
      { error: 'Failed to answer project question.' },
      { status: 500 }
    );
  }
}
