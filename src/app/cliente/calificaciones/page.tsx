'use client';

import { useEffect, useState } from 'react';
import { Star, MessageSquare, ThumbsUp, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { formatRelativeTime } from '@/lib/utils';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  professionalism_rating: number | null;
  communication_rating: number | null;
  quality_rating: number | null;
  timeliness_rating: number | null;
  created_at: string;
  cases: {
    case_number: string;
    title: string;
  } | null;
  profiles: {
    full_name: string;
    avatar_url: string | null;
  } | null;
}

export default function CalificacionesPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ average: 0, total: 0 });

  useEffect(() => {
    async function loadReviews() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      // Get reviews where the current user is the reviewer
      const { data } = await supabase
        .from('reviews')
        .select(`
          *,
          cases (case_number, title),
          profiles:reviewed_id (full_name, avatar_url)
        `)
        .eq('reviewer_id', user.id)
        .order('created_at', { ascending: false });

      const typedData = (data || []) as Review[];
      setReviews(typedData);

      if (typedData.length > 0) {
        const avg = typedData.reduce((sum, r) => sum + r.rating, 0) / typedData.length;
        setStats({ average: avg, total: typedData.length });
      }

      setLoading(false);
    }

    loadReviews();
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mis Calificaciones</h1>
        <p className="text-gray-500 mt-1">
          Historial de calificaciones que has dado a los peritos
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Promedio dado</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.average.toFixed(1)}/5
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <ThumbsUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total reseñas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Con comentario</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.filter(r => r.comment).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Calificaciones</CardTitle>
          <CardDescription>
            Todas las calificaciones que has dado a peritos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No has dado calificaciones aún</p>
              <p className="text-sm text-gray-400 mt-1">
                Las calificaciones aparecerán aquí cuando completes casos
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">{renderStars(review.rating)}</div>
                        <Badge variant="secondary">
                          {review.cases?.case_number}
                        </Badge>
                      </div>
                      <h3 className="font-medium text-gray-900">
                        {review.profiles?.full_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {review.cases?.title}
                      </p>
                      {review.comment && (
                        <p className="mt-2 text-gray-600 text-sm">
                          &quot;{review.comment}&quot;
                        </p>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatRelativeTime(review.created_at)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
