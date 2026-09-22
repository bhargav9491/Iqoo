import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth';
import { AIEngine } from '@/lib/ai-engine';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; procId: string; stepId: string } }
) {
  try {
    const { id: projectId, procId: procedureId, stepId } = params;
    const user = await getAuthenticatedUser(req);
    const { observationText, imageUrl, humanConfirmedStatus } = await req.json();

    const step = await prisma.procedureStep.findUnique({
      where: { id: stepId },
    });

    if (!step) {
      return NextResponse.json({ error: 'Step not found.' }, { status: 404 });
    }

    if (humanConfirmedStatus) {
      // Human in the loop confirmation/override
      const updatedStep = await prisma.procedureStep.update({
        where: { id: stepId },
        data: {
          reviewStatus: humanConfirmedStatus,
          observationNotes: observationText || step.observationNotes,
          verificationOutcome: humanConfirmedStatus,
        },
      });

      // Update project updated timestamp
      await prisma.project.update({
        where: { id: projectId },
        data: { updatedAt: new Date() },
      });

      // Log Activity Event
      await prisma.activityEvent.create({
        data: {
          projectId,
          userId: user?.id,
          type: 'PROCEDURE_CHECKED',
          title: `Step Verified: ${step.title}`,
          description: `Status marked as "${humanConfirmedStatus}" by ${user?.name || 'Engineer'}.`,
        },
      });

      return NextResponse.json({ step: updatedStep, message: 'Step review status updated.' });
    }

    // AI Evaluation of Step Observation
    const evaluation = AIEngine.evaluateProcedureObservation(
      step,
      observationText || '',
      Boolean(imageUrl)
    );

    const observation = await prisma.procedureObservation.create({
      data: {
        stepId,
        imageUrl: imageUrl || null,
        observationText: observationText || 'Observation submitted for review.',
        confidence: evaluation.confidence,
        deviationDetected: evaluation.deviationDetected,
        deviationDetails: evaluation.deviationDetails,
        verificationStatus: 'PENDING_HUMAN_CONFIRMATION',
      },
    });

    // Update step review status based on evaluation
    const updatedStep = await prisma.procedureStep.update({
      where: { id: stepId },
      data: {
        reviewStatus: evaluation.deviationDetected ? 'DEVIATION_DETECTED' : 'VERIFIED',
        observationNotes: observationText,
        verificationOutcome: evaluation.verificationOutcome,
      },
    });

    // Also update project memory
    await prisma.activityEvent.create({
      data: {
        projectId,
        userId: user?.id,
        type: 'PROCEDURE_CHECKED',
        title: evaluation.deviationDetected
          ? `Potential Deviation Alert in Step ${step.stepOrder}`
          : `Step ${step.stepOrder} Verified`,
        description: evaluation.deviationDetected
          ? evaluation.deviationDetails || 'Potential discrepancy detected.'
          : `Step "${step.title}" verified with ${Math.round(evaluation.confidence * 100)}% confidence.`,
      },
    });

    return NextResponse.json({
      evaluation,
      observation,
      step: updatedStep,
    });
  } catch (error: any) {
    console.error('Error verifying procedure step:', error);
    return NextResponse.json(
      { error: 'Failed to verify procedure step.' },
      { status: 500 }
    );
  }
}
