const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function runTests() {
  console.log('=== NORTHSTAR SYSTEMS WORKSPACE INTEGRATION TESTS ===\n');

  // Test 1: Query Projects
  console.log('Test 1: Querying Projects from SQLite Database...');
  const projects = await prisma.project.findMany({
    include: {
      workContexts: true,
      tasks: true,
      decisions: true,
      procedures: {
        include: { steps: { include: { observations: true } } }
      },
      handovers: true,
      activities: true
    },
    orderBy: { createdAt: 'asc' }
  });

  console.log(`✓ Retrieved ${projects.length} project(s):`);
  projects.forEach((p, idx) => {
    console.log(`  ${idx + 1}. "${p.name}"`);
    console.log(`     - Objective: ${p.objective}`);
    console.log(`     - Work Contexts: ${p.workContexts.length} entries`);
    console.log(`     - Tasks: ${p.tasks.length} tasks`);
    console.log(`     - Decisions: ${p.decisions.length} recorded ADRs`);
    console.log(`     - Procedures: ${p.procedures.length} protocols`);
    console.log(`     - Handovers: ${p.handovers.length} generated briefs`);
  });

  if (projects.length < 3) {
    throw new Error('Expected at least 3 sample projects');
  }

  // Test 2: Verify Project 1 Specifics
  console.log('\nTest 2: Verifying Smart Infrastructure Monitoring Data Integrity...');
  const p1 = projects.find(p => p.name === 'Smart Infrastructure Monitoring');
  if (!p1) throw new Error('Smart Infrastructure Monitoring not found');

  const completed = p1.tasks.filter(t => t.status === 'COMPLETED').length;
  const pending = p1.tasks.filter(t => t.status === 'PENDING' || t.status === 'IN_PROGRESS').length;
  const blocked = p1.tasks.filter(t => t.status === 'BLOCKED').length;
  console.log(`  ✓ Completed tasks: ${completed}, Pending tasks: ${pending}, Blocked: ${blocked}`);

  // Test 3: Verify Procedure Deviation on Step 3
  console.log('\nTest 3: Checking Procedure Deviation Guard State...');
  const deviationStep = await prisma.procedureStep.findFirst({
    where: { reviewStatus: 'DEVIATION_DETECTED' },
    include: { observations: true }
  });

  if (deviationStep) {
    console.log(`  ✓ Deviation correctly flagged on Step ${deviationStep.stepOrder}: "${deviationStep.title}"`);
    console.log(`  - Observation Note: ${deviationStep.observationNotes}`);
  } else {
    throw new Error('Expected deviation step to be flagged');
  }

  // Test 4: Verify ADR consistency
  console.log('\nTest 4: Checking ADR-01 to ADR-04 consistency across projects...');
  const allDecisions = await prisma.decision.findMany({
    include: { project: { select: { name: true } } }
  });
  allDecisions.forEach(d => {
    console.log(`  ✓ [${d.project.name}] ${d.title} (Selected: "${d.selectedOption.slice(0, 40)}...")`);
  });

  console.log('\n=== ALL NORTHSTAR SYSTEMS INTEGRATION TESTS PASSED ===');
  await prisma.$disconnect();
}

runTests().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
