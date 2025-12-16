'use client';

import { useEffect, useState } from 'react';
import { Star, MessageSquare, TrendingUp, Calendar, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  is_public: boolean;
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

export default function ResenasPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    average: 0,
    total: 0,
    professionalism: 0,
    communication: 0,
    quality: 0,
    timeliness: 0,
  });

  useEffect(() => {
    async function loadReviews() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      // Get reviews where the current user is being reviewed
      const { data } = await supabase
        .from('reviews')
        .select(`
          *,
          cases (case_number, title),
          profiles:reviewer_id (full_name, avatar_url)
        `)
        .eq('reviewed_id', user.id)
        .order('created_at', { ascending: false });

      const typedData = (data || []) as Review[];
      setReviews(typedData);

      if (typedData.length > 0) {
        const avg = typedData.reduce((sum, r) => sum + r.rating, 0) / typedData.length;
        const prof = typedData.filter(r => r.professionalism_rating).reduce((sum, r) => sum + (r.professionalism_rating || 0), 0) / typedData.filter(r => r.professionalism_rating).length || 0;
        const comm = typedData.filter(r => r.communication_rating).reduce((sum, r) => sum + (r.communication_rating || 0), 0) / typedData.filter(r => r.communication_rating).length || 0;
        const qual = typedData.filter(r => r.quality_rating).reduce((sum, r) => sum + (r.quality_rating || 0), 0) / typedData.filter(r => r.quality_rating).length || 0;
        const time = typedData.filter(r => r.timeliness_rating).reduce((sum, r) => sum + (r.timeliness_rating || 0), 0) / typedData.filter(r => r.timeliness_rating).length || 0;

        setStats({
          average: avg,
          total: typedData.length,
          professionalism: prof,
          communication: comm,
          quality: qual,
          timeliness: time,
        });
      }

      setLoading(false);
    }

    loadReviews();
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
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
        <h1 className="text-2xl font-bold text-gray-900">Mis Reseñas</h1>
        <p className="text-gray-500 mt-1">
          Calificaciones y comentarios de tus clientes
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="flex justify-center mb-2">{renderStars(stats.average)}</div>
              <p className="text-3xl font-bold text-gray-900">{stats.average.toFixed(1)}</p>
              <p className="text-sm text-gray-500">Calificación promedio</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-500">Total reseñas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.filter(r => r.rating >= 4).length}
                </p>
                <p className="text-sm text-gray-500">Reseñas positivas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.quality.toFixed(1)}</p>
                <p className="text-sm text-gray-500">Calidad promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Ratings */}
      <Card>
        <CardHeader>
          <CardTitle>Desglose de Calificaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: 'Profesionalismo', value: stats.professionalism },
              { label: 'Comunicación', value: stats.communication },
              { label: 'Calidad del trabajo', value: stats.quality },
              { label: 'Puntualidad', value: stats.timeliness },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-4">
                <span className="text-sm text-gray-700 w-40">{item.label}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(item.value / 5) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-12 text-right">
                  {item.value.toFixed(1)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <Card>
        <CardHeader>
          <CardTitle>Todas las Reseñas</CardTitle>
          <CardDescription>
            Comentarios y calificaciones de tus clientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aún no tienes reseñas</p>
              <p className="text-sm text-gray-400 mt-1">
                Las reseñas aparecerán aquí cuando completes casos
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-4 rounded-lg border border-gray-200"
                >
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={review.profiles?.avatar_url || undefined} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {review.profiles?.full_name ? getInitials(review.profiles.full_name) : <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {review.profiles?.full_name || 'Cliente anónimo'}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">{renderStars(review.rating)}</div>
                            <Badge variant="secondary" className="text-xs">
                              {review.cases?.case_number}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatRelativeTime(review.created_at)}
                        </div>
                      </div>
                      {review.comment && (
                        <p className="mt-3 text-gray-600">{review.comment}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-2">
                        Caso: {review.cases?.title}
                      </p>
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
