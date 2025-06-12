import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, 
  TrendingUp, 
  Clock, 
  Star,
  Plus,
  Brain,
  Target,
  Zap
} from 'lucide-react';

export default function DashboardPage() {
  // Datos de ejemplo para el dashboard
  const stats = [
    {
      title: "Ideas Totales",
      value: "42",
      description: "Ideas creadas este mes",
      icon: Lightbulb,
      trend: "+12%"
    },
    {
      title: "En Progreso",
      value: "8",
      description: "Ideas en desarrollo",
      icon: Clock,
      trend: "+3"
    },
    {
      title: "Completadas",
      value: "15",
      description: "Ideas finalizadas",
      icon: Target,
      trend: "+5"
    },
    {
      title: "Favoritas",
      value: "6",
      description: "Ideas marcadas como favoritas",
      icon: Star,
      trend: "+2"
    }
  ];

  const recentIdeas = [
    {
      title: "App de Meditación Gamificada",
      category: "Tecnología",
      status: "en_progreso",
      priority: "alta",
      date: "Hace 2 horas"
    },
    {
      title: "Jardín Vertical Inteligente",
      category: "Sostenibilidad",
      status: "nueva",
      priority: "media",
      date: "Hace 1 día"
    },
    {
      title: "Plataforma de Intercambio de Habilidades",
      category: "Social",
      status: "en_revision",
      priority: "alta",
      date: "Hace 3 días"
    }
  ];

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Bienvenido a tu centro de control de ideas
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Brain className="h-4 w-4 mr-2" />
            Auto-organizar
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Idea
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <div className="flex items-center pt-1">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-500">{stat.trend}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Ideas */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Ideas Recientes
            </CardTitle>
            <CardDescription>
              Tus últimas ideas creadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentIdeas.map((idea, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{idea.title}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {idea.category}
                      </Badge>
                      <Badge 
                        variant={idea.status === 'nueva' ? 'default' : 
                                idea.status === 'en_progreso' ? 'destructive' : 'outline'}
                        className="text-xs"
                      >
                        {idea.status.replace('_', ' ')}
                      </Badge>
                      <Badge 
                        variant={idea.priority === 'alta' ? 'destructive' : 'outline'}
                        className="text-xs"
                      >
                        {idea.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{idea.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Sugerencias IA
            </CardTitle>
            <CardDescription>
              Recomendaciones personalizadas para ti
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900">
                  💡 Combinar ideas similares
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Tienes 3 ideas sobre aplicaciones móviles que podrían fusionarse
                </p>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-900">
                  🚀 Priorizar por impacto
                </p>
                <p className="text-xs text-green-700 mt-1">
                  "Jardín Vertical Inteligente" tiene alto potencial de éxito
                </p>
              </div>
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm font-medium text-purple-900">
                  📅 Revisar ideas antiguas
                </p>
                <p className="text-xs text-purple-700 mt-1">
                  5 ideas llevan más de 30 días sin actualizarse
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}