import { NextRequest, NextResponse } from 'next/server';

// POST /api/results — save a test result
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testId, resultTypeId, answers } = body;

    if (!testId || !resultTypeId) {
      return NextResponse.json(
        { error: 'testId and resultTypeId are required' },
        { status: 400 }
      );
    }

    // Try to save to Supabase if configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      try {
        const { createServerSupabaseClient } = await import('@/lib/supabase/server');
        const supabase = await createServerSupabaseClient();

        const { data, error } = await supabase
          .from('test_results')
          .insert({
            test_id: testId,
            result_type_id: resultTypeId,
            answers: answers ?? [],
          })
          .select('id')
          .single();

        if (error) throw error;

        return NextResponse.json({
          success: true,
          resultId: data.id,
          resultTypeId,
        });
      } catch (dbError) {
        console.error('Supabase error:', dbError);
        // Fall through to graceful degradation
      }
    }

    // Graceful degradation: return resultTypeId as the "ID"
    return NextResponse.json({
      success: true,
      resultId: resultTypeId,
      resultTypeId,
    });
  } catch (error) {
    console.error('Results API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/results/:id — retrieve a saved result
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  // Try Supabase first
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const { createServerSupabaseClient } = await import('@/lib/supabase/server');
      const supabase = await createServerSupabaseClient();

      const { data, error } = await supabase
        .from('test_results')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        return NextResponse.json({ result: data });
      }
    } catch (dbError) {
      console.error('Supabase error:', dbError);
    }
  }

  // Graceful degradation: treat id as resultTypeId
  return NextResponse.json({ result: { result_type_id: id } });
}
