import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET /api/comments?testId=...&resultTypeId=...
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const testId = searchParams.get('testId');
  const resultTypeId = searchParams.get('resultTypeId');

  if (!testId) {
    return NextResponse.json({ error: 'testId is required' }, { status: 400 });
  }

  // Try Supabase if configured
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    try {
      const { createServerSupabaseClient } = await import('@/lib/supabase/server');
      const supabase = await createServerSupabaseClient();

      let query = supabase
        .from('comments')
        .select('*')
        .eq('test_id', testId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (resultTypeId) {
        query = query.eq('result_type_id', resultTypeId);
      }

      const { data, error } = await query;

      if (error) throw error;

      const comments = (data ?? []).map(row => ({
        id: row.id,
        nickname: row.nickname,
        content: row.content,
        resultTypeId: row.result_type_id,
        createdAt: row.created_at,
        emoji: row.emoji ?? '💬',
      }));

      return NextResponse.json({ comments });
    } catch (dbError) {
      console.error('Supabase error:', dbError);
    }
  }

  // Graceful degradation: return empty comments
  return NextResponse.json({ comments: [] });
}

// POST /api/comments
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testId, resultTypeId, nickname, content, emoji } = body;

    // Validation
    if (!testId || !resultTypeId || !nickname || !content) {
      return NextResponse.json(
        { error: '필수 항목이 누락되었습니다.' },
        { status: 400 }
      );
    }

    if (nickname.trim().length > 10) {
      return NextResponse.json({ error: '닉네임은 10자 이하여야 합니다.' }, { status: 400 });
    }

    if (content.trim().length < 5 || content.trim().length > 300) {
      return NextResponse.json(
        { error: '댓글은 5자 이상 300자 이하여야 합니다.' },
        { status: 400 }
      );
    }

    // Try Supabase if configured
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      try {
        const { createServerSupabaseClient } = await import('@/lib/supabase/server');
        const supabase = await createServerSupabaseClient();

        const { data, error } = await supabase
          .from('comments')
          .insert({
            test_id: testId,
            result_type_id: resultTypeId,
            nickname: nickname.trim(),
            content: content.trim(),
            emoji: emoji ?? '💬',
          })
          .select()
          .single();

        if (error) throw error;

        return NextResponse.json({
          success: true,
          comment: {
            id: data.id,
            nickname: data.nickname,
            content: data.content,
            resultTypeId: data.result_type_id,
            createdAt: data.created_at,
            emoji: data.emoji,
          },
        });
      } catch (dbError) {
        console.error('Supabase error:', dbError);
        return NextResponse.json(
          { error: 'Supabase가 설정되지 않았습니다. 나중에 다시 시도해주세요.' },
          { status: 503 }
        );
      }
    }

    // No Supabase configured
    return NextResponse.json(
      { error: '댓글 기능을 사용하려면 Supabase를 설정해주세요.' },
      { status: 503 }
    );
  } catch (error) {
    console.error('Comments API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
