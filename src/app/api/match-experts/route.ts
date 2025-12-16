import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { Specialty, UrgencyLevel } from '@/types/database';

interface ExpertProfileData {
  id: string;
  user_id: string;
  specialties: string[];
  rating_average: number | null;
  city: string | null;
  response_time_hours: number;
  experience_years: number | null;
  completed_cases: number;
  is_available: boolean;
  profiles: { id: string; full_name: string; avatar_url: string | null } | null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { specialty, urgency, city } = body as {
      specialty: Specialty;
      urgency: UrgencyLevel;
      city: string;
    };

    if (!specialty) {
      return NextResponse.json(
        { error: 'Specialty is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get verified, available experts with matching specialty
    const { data: experts, error } = await supabase
      .from('expert_profiles')
      .select(`
        *,
        profiles (id, full_name, avatar_url)
      `)
      .eq('verification_status', 'verified')
      .eq('is_available', true)
      .contains('specialties', [specialty])
      .order('rating_average', { ascending: false });

    if (error) {
      console.error('Error fetching experts:', error);
      return NextResponse.json(
        { error: 'Error fetching experts' },
        { status: 500 }
      );
    }

    // Calculate match scores
    const expertsTyped = (experts || []) as ExpertProfileData[];
    const matches = expertsTyped.map((expert) => {
      let score = 50; // Base score
      const reasons: string[] = [];

      // Specialty match (already filtered, so always +30)
      score += 30;
      reasons.push('Especialidad coincidente');

      // Rating bonus (up to 15 points)
      const ratingBonus = (expert.rating_average || 0) * 3;
      score += ratingBonus;
      if ((expert.rating_average || 0) >= 4.5) {
        reasons.push('Calificación excelente');
      }

      // City match (+5)
      if (city && expert.city?.toLowerCase() === city.toLowerCase()) {
        score += 5;
        reasons.push('Misma ciudad');
      }

      // Response time bonus
      if (expert.response_time_hours <= 12) {
        score += 5;
        reasons.push('Respuesta rápida');
      }

      // Experience bonus (up to 10 points)
      score += Math.min(expert.experience_years || 0, 10);
      if (expert.completed_cases >= 10) {
        reasons.push('Experiencia comprobada');
      }

      // Urgency handling
      if (urgency === 'critical' && expert.response_time_hours <= 24) {
        score += 10;
        reasons.push('Disponible para casos urgentes');
      } else if (urgency === 'urgent' && expert.response_time_hours <= 48) {
        score += 5;
      }

      // Completed cases bonus
      if (expert.completed_cases >= 50) {
        score += 5;
        reasons.push('Alto volumen de casos completados');
      }

      return {
        expert_id: expert.id,
        expert: expert as unknown,
        match_score: Math.min(score, 100), // Cap at 100
        reasons,
        estimated_response_time: `${expert.response_time_hours || 24}h`,
        availability: expert.is_available,
      };
    });

    // Sort by score
    matches.sort((a, b) => b.match_score - a.match_score);

    // Return top 10 matches
    return NextResponse.json({
      matches: matches.slice(0, 10),
      total: matches.length,
    });
  } catch (error) {
    console.error('Error in match-experts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
