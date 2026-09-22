import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

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
        handovers: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 });
    }

    const nodes: any[] = [];
    const edges: any[] = [];

    // 1. Central Project Node
    nodes.push({
      id: `project-${project.id}`,
      label: project.name,
      type: 'PROJECT',
      status: project.status,
      details: project.objective,
    });

    // 2. Decision Nodes
    project.decisions.forEach((d) => {
      const dId = `decision-${d.id}`;
      nodes.push({
        id: dId,
        label: d.title,
        type: 'DECISION',
        status: d.status,
        details: `Selected: ${d.selectedOption} | Reason: ${d.reasoning}`,
        author: d.author,
      });

      edges.push({
        id: `edge-${project.id}-${d.id}`,
        source: `project-${project.id}`,
        target: dId,
        relation: 'DECIDED_IN',
      });
    });

    // 3. Work Context Nodes
    project.workContexts.forEach((c) => {
      const cId = `context-${c.id}`;
      nodes.push({
        id: cId,
        label: c.title,
        type: 'CONTEXT',
        category: c.category,
        details: c.content,
        author: c.author,
      });

      edges.push({
        id: `edge-${project.id}-${c.id}`,
        source: `project-${project.id}`,
        target: cId,
        relation: 'CAPTURED_IN',
      });
    });

    // 4. Task Nodes
    project.tasks.forEach((t) => {
      const tId = `task-${t.id}`;
      nodes.push({
        id: tId,
        label: t.title,
        type: 'TASK',
        status: t.status,
        priority: t.priority,
        assignee: t.assignee,
      });

      edges.push({
        id: `edge-${project.id}-${t.id}`,
        source: `project-${project.id}`,
        target: tId,
        relation: 'TRACKED_IN',
      });
    });

    // 5. Procedure Nodes
    project.procedures.forEach((p) => {
      const pId = `proc-${p.id}`;
      nodes.push({
        id: pId,
        label: p.title,
        type: 'PROCEDURE',
        status: p.status,
        details: p.description,
      });

      edges.push({
        id: `edge-${project.id}-${p.id}`,
        source: `project-${project.id}`,
        target: pId,
        relation: 'STANDARDIZED_BY',
      });
    });

    // 6. Handover Node
    project.handovers.forEach((h) => {
      const hId = `handover-${h.id}`;
      nodes.push({
        id: hId,
        label: h.title,
        type: 'HANDOVER',
        details: h.executiveSummary,
      });

      edges.push({
        id: `edge-${project.id}-${h.id}`,
        source: `project-${project.id}`,
        target: hId,
        relation: 'SUMMARIZED_BY',
      });
    });

    return NextResponse.json({
      graph: {
        nodes,
        edges,
        stats: {
          totalNodes: nodes.length,
          totalEdges: edges.length,
          decisions: project.decisions.length,
          contexts: project.workContexts.length,
          tasks: project.tasks.length,
        },
      },
    });
  } catch (error: any) {
    console.error('Error generating graph data:', error);
    return NextResponse.json(
      { error: 'Failed to generate knowledge graph data.' },
      { status: 500 }
    );
  }
}
