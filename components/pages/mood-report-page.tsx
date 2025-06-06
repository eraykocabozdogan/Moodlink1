"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, TrendingDown, Calendar, BarChart3, Heart, Brain } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import apiClient from "@/lib/apiClient"
import { useToast } from "@/hooks/use-toast"

// --- API'den Gelecek Veriler İçin Tipler (Varsayımsal) ---
// NOT: Bu tipleri, backend'den gelen gerçek yanıta göre güncellemeniz gerekebilir.
interface MoodScore {
  date: string; // "2024-06-01T00:00:00Z"
  emotion: string;
  score: number;
}

interface AdvancedAnalysis {
  highestMood: { mood: string; score: number };
  lowestMood: { mood: string; score: number };
  averageEnergy: number;
  dominantEmotion: string;
  recommendations: string[];
}
// ---

interface MoodReportPageProps {
  user: {
    id: string;
    // ...diğer kullanıcı bilgileri
  };
}

type Period = 'week' | 'month';

export function MoodReportPage({ user }: MoodReportPageProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("week")
  const [reportData, setReportData] = useState<any[]>([]) // Grafik için veriyi tutar
  const [analysis, setAnalysis] = useState<AdvancedAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchMoodReport = useCallback(async (period: Period) => {
    if (!user?.id) return;
    setIsLoading(true);

    try {
      // API endpoint'leri ve parametreleri swagger'a göre ayarlandı.
      const reportPromise = apiClient.get<MoodScore[]>(`/api/EmotionScores/mood-report/${user.id}`, { period: period });
      const analysisPromise = apiClient.get<AdvancedAnalysis>(`/api/EmotionScores/advanced-analysis/${user.id}`);
      
      const [reportResponse, analysisResponse] = await Promise.all([reportPromise, analysisPromise]);

      // Grafik için veriyi işle
      const processedData = reportResponse.map(item => ({
        name: new Date(item.date).toLocaleDateString('tr-TR', { weekday: 'short' }),
        [item.emotion]: item.score,
      })).reduce((acc, current) => {
        const existing = acc.find(item => item.name === current.name);
        if (existing) {
          Object.assign(existing, current);
        } else {
          acc.push(current);
        }
        return acc;
      }, [] as Record<string, any>[]);


      setReportData(processedData);
      setAnalysis(analysisResponse);

    } catch (error) {
      console.error(`Failed to fetch mood report:`, error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Ruh hali raporu yüklenirken bir sorun oluştu.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, toast]);

  useEffect(() => {
    fetchMoodReport(selectedPeriod);
  }, [selectedPeriod, fetchMoodReport]);

  const insights = analysis ? [
    { title: "En Yüksek Mod", value: analysis.highestMood.mood, description: `Skor: ${analysis.highestMood.score.toFixed(1)}/10`, icon: TrendingUp, color: "text-green-600" },
    { title: "İlgi Gerektiren Mod", value: analysis.lowestMood.mood, description: `Skor: ${analysis.lowestMood.score.toFixed(1)}/10`, icon: TrendingDown, color: "text-orange-600" },
    { title: "Genel Durum", value: analysis.dominantEmotion, description: "Baskın duygu", icon: Heart, color: "text-purple-600" },
    { title: "Enerji Seviyesi", value: `${analysis.averageEnergy.toFixed(1)}/10`, description: "Ortalama enerji", icon: Brain, color: "text-blue-600" },
  ] : [];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="sticky top-0 bg-card/80 backdrop-blur-sm border-b border-border p-4">
        <h1 className="text-xl font-bold text-foreground text-center">Ruh Hali Raporu</h1>
      </div>

      <div className="p-4 space-y-6">
        <div className="flex space-x-2">
          <Button onClick={() => setSelectedPeriod("week")} variant={selectedPeriod === "week" ? "default" : "outline"} className={`${selectedPeriod === "week" ? "bg-gradient-to-r from-purple-500 to-pink-500 text-primary-foreground" : ""}`}>
            <Calendar className="w-4 h-4 mr-2" /> Haftalık
          </Button>
          <Button onClick={() => setSelectedPeriod("month")} variant={selectedPeriod === "month" ? "default" : "outline"} className={`${selectedPeriod === "month" ? "bg-gradient-to-r from-purple-500 to-pink-500 text-primary-foreground" : ""}`}>
            <BarChart3 className="w-4 h-4 mr-2" /> Aylık
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-80 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>
            <Skeleton className="h-48 w-full" />
          </div>
        ) : (
          <>
            <Card>
              <CardHeader><CardTitle>Ruh Hali Grafiği</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                    <Legend />
                    <Bar dataKey="happiness" fill="#8884d8" name="Mutluluk" />
                    <Bar dataKey="stress" fill="#82ca9d" name="Stres" />
                    <Bar dataKey="energy" fill="#ffc658" name="Enerji" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {analysis && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {insights.map((insight, index) => {
                    const Icon = insight.icon;
                    return (
                      <Card key={index}>
                        <CardContent className="p-4 flex items-center space-x-3">
                          <Icon className={`w-8 h-8 ${insight.color}`} />
                          <div>
                            <p className="font-bold text-lg">{insight.value}</p>
                            <p className="text-xs text-muted-foreground">{insight.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <Card>
                  <CardHeader><CardTitle>Öneriler</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                      {analysis.recommendations?.length > 0 ? (
                        analysis.recommendations.map((rec, index) => <li key={index}>{rec}</li>)
                      ) : (
                        <li>Size özel bir öneri bulunamadı.</li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}