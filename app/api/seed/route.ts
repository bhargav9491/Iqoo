import { NextRequest, NextResponse } from 'next/server';
import { seedDemoData } from '@/lib/seed-data';

export async function POST(req: NextRequest) {
  try {
    const project = await seedDemoData();
    return NextResponse.json({
      success: true,
      message: 'Demo workspace initialized successfully.',
      projectId: project.id,
    });
  } catch (error: any) {
    console.error('Error seeding data:', error);
    return NextResponse.json(
      { error: 'Failed to seed demo data.' },
      { status: 500 }
    );
  }
}
