'use client';

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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';
import { Brain, TrendingUp, TrendingDown, Zap, Lightbulb, PlayCircle, CheckCircle } from 'lucide-react';
import { SelectIdea } from '@/lib/db/schema';
import { useRouter } from 'next/navigation';
import {  useEffect, useMemo, useState } from 'react';

interface DashboardData {
  totalIdeas: number;
  inProgress: number;
  completed: number;
  recentIdeas: SelectIdea[];
  monthlyCharts: {
    createdByMonth: Array<{ month: string; value: number }>;
    completedByMonth: Array<{ month: string; value: number }>;
    inProgressByMonth: Array<{ month: string; value: number }>;
  };
}

interface StatsClientProps {
  dashboardData: DashboardData;
}

export default function StatsClient({ dashboardData }: StatsClientProps) {
  const { totalIdeas, inProgress, completed, recentIdeas, monthlyCharts } = dashboardData;
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const calculateMonthlyChange = (chartData: Array<{ month: string; value: number }>) => {
    if (chartData.length < 2) return { percentage: 0, isPositive: true };
    
    const currentMonth = chartData[chartData.length - 1].value;
    const previousMonth = chartData[chartData.length - 2].value;
    
    if (previousMonth === 0) {
      return { 
        percentage: currentMonth > 0 ? 100 : 0, 
        isPositive: currentMonth >= 0 
      };
    }
    
    const change = ((currentMonth - previousMonth) / previousMonth) * 100;
    return { 
      percentage: Math.round(Math.abs(change)), 
      isPositive: change >= 0 
    };
  };

  const statsData = useMemo(() => {
    const createdChange = calculateMonthlyChange(monthlyCharts.createdByMonth);
    const inProgressChange = calculateMonthlyChange(monthlyCharts.inProgressByMonth);
    const completedChange = calculateMonthlyChange(monthlyCharts.completedByMonth);

    return [
      {
        title: "Total Ideas",
        value: totalIdeas,
        description: "Total registered ideas",
        icon: Lightbulb,
        trend: createdChange.percentage > 0 
          ? `${createdChange.isPositive ? '+' : '-'}${createdChange.percentage}% from last month`
          : "No change from last month",
        isPositive: createdChange.isPositive,
        chartData: monthlyCharts.createdByMonth,
        chartConfig: {
          value: {
            label: "Ideas Created"
          },
        },
        showChart: true
      },
      {
        title: "In Progress", 
        value: inProgress,
        description: "Ideas currently in development",
        icon: PlayCircle,
        trend: inProgressChange.percentage > 0 
          ? `${inProgressChange.isPositive ? '+' : '-'}${inProgressChange.percentage}% from last month`
          : "No change from last month",
        isPositive: inProgressChange.isPositive,
        chartData: monthlyCharts.inProgressByMonth,
        chartConfig: {
          value: {
            label: "In Progress"
          },
        },
        showChart: true
      },
      {
        title: "Completed",
        value: completed,
        description: "Successfully finished ideas", 
        icon: CheckCircle,
        trend: completedChange.percentage > 0 
          ? `${completedChange.isPositive ? '+' : '-'}${completedChange.percentage}% from last month`
          : "No change from last month",
        isPositive: completedChange.isPositive,
        chartData: monthlyCharts.completedByMonth,
        chartConfig: {
          value: {
            label: "Completed"
          },
        },
        showChart: true
      }
    ];
  }, [totalIdeas, inProgress, completed, monthlyCharts]);

  const gotoIdea = (id: number) => () => {
    router.push(`/dashboard/ideas/${id}`);
  }

  useEffect(() => {
    console.log('StatsClient client-side effect:', {
      dashboardData,
      timestamp: new Date().toISOString()
    });
  }, []);

  if (!isClient) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome to your idea control center
            </p>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="animate-pulse">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your idea control center
          </p>
        </div>
        <div className="flex gap-2">
          <Button className='bg-rainbow hover:bg-rainbow-hover' variant="default" size="sm">
            <Brain className="h-4 w-4 mr-2" />
            Auto-organize
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4">
        {/* Mobile: Primera fila - Total Ideas ocupa todo el ancho */}
        <div className="grid gap-4 grid-cols-1 md:hidden">
          {statsData.slice(0, 1).map((stat, index) => {
            const Icon = stat.icon;
            
            return (
              <Card key={index} className={`relative overflow-hidden ${stat.showChart ? '' : 'h-fit flex flex-col'}`}>
                <CardHeader className={`flex flex-row items-center justify-between space-y-0 ${stat.showChart ? 'pb-2' : 'pb-0 flex-shrink-0'}`}>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className={stat.showChart ? '' : 'flex-1 flex flex-col justify-center pt-0'}>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-3">
                    {stat.isPositive ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-gray-400" />
                    )}
                    <span className={stat.isPositive ? "text-green-500 font-medium" : "text-gray-500"}>
                      {stat.trend}
                    </span>
                  </div>
                  {/* Mini line chart - solo si showChart es true */}
                  {stat.showChart && (
                    <div>
                      <ChartContainer config={stat.chartConfig}>
                        <LineChart
                          accessibilityLayer
                          data={stat.chartData}
                          margin={{
                            left: 12,
                            right: 12,
                            top: 5,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid vertical={false} />
                          <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value}
                          />
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                          />
                          <Line
                            dataKey="value"
                            type="natural"
                            className='stroke-accent'
                            strokeWidth={2}
                            activeDot={{
                              r: 5,
                            }}
                          />
                        </LineChart>
                      </ChartContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Mobile: Segunda fila - En Progreso y Completadas lado a lado */}
        <div className="grid gap-4 grid-cols-2 md:hidden">
          {statsData.slice(1, 3).map((stat, index) => {
            const Icon = stat.icon;
            
            return (
              <Card key={index + 1} className={`relative overflow-hidden ${stat.showChart ? '' : 'h-fit flex flex-col'}`}>
                <CardHeader className={`flex flex-row items-center justify-between space-y-0 ${stat.showChart ? 'pb-2' : 'pb-0 flex-shrink-0'}`}>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className={stat.showChart ? '' : 'flex-1 flex flex-col justify-center pt-0'}>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-3">
                    {stat.isPositive ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-gray-400" />
                    )}
                    <span className={stat.isPositive ? "text-green-500 font-medium" : "text-gray-500"}>
                      {stat.trend}
                    </span>
                  </div>
                  {/* Mini line chart - solo si showChart es true */}
                  {stat.showChart && (
                    <div>
                      <ChartContainer config={stat.chartConfig}>
                        <LineChart
                          accessibilityLayer
                          data={stat.chartData}
                          margin={{
                            left: 12,
                            right: 12,
                            top: 5,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid vertical={false} />
                          <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value}
                          />
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                          />
                          <Line
                            dataKey="value"
                            type="natural"
                            className='stroke-accent'
                            strokeWidth={2}
                            activeDot={{
                              r: 5,
                            }}
                          />
                        </LineChart>
                      </ChartContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Desktop: Todas las tarjetas en 3 columnas */}
        <div className="hidden md:grid gap-4 grid-cols-3">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            
            return (
              <Card key={index} className={`relative overflow-hidden ${stat.showChart ? 'h-60' : 'h-fit flex flex-col'}`}>
                <CardHeader className={`flex flex-row items-center justify-between space-y-0 ${stat.showChart ? 'pb-2' : 'pb-0 flex-shrink-0'}`}>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className={stat.showChart ? '' : 'flex-1 flex flex-col justify-center pt-0'}>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-3">
                    {stat.isPositive ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-gray-400" />
                    )}
                    <span className={stat.isPositive ? "text-green-500 font-medium" : "text-gray-500"}>
                      {stat.trend}
                    </span>
                  </div>
                  {/* Mini line chart - solo si showChart es true */}
                  {stat.showChart && (
                    <div>
                      <ChartContainer className='h-32 w-full' config={stat.chartConfig}>
                        <LineChart
                          accessibilityLayer
                          data={stat.chartData}
                          margin={{
                            left: 12,
                            right: 12,
                            top: 5,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid vertical={false} />
                          <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value}
                          />
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                          />
                          <Line
                            dataKey="value"
                            type="natural"
                            className='stroke-accent'
                            strokeWidth={2}
                            activeDot={{
                              r: 5,
                            }}
                          />
                        </LineChart>
                      </ChartContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Ideas */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Recent Ideas
            </CardTitle>
            <CardDescription>Your last 3 created ideas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentIdeas.length > 0 ? (
                recentIdeas.map((idea) => (
                  <div
                    onClick={gotoIdea(idea.id)}
                    key={idea.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1 flex-1">
                      <p className="font-medium text-sm line-clamp-1">{idea.title}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                          {idea.category}
                        </Badge>
                        <Badge
                          variant={
                            idea.status === 'new'
                              ? 'default'
                              : idea.status === 'in_progress'
                                ? 'destructive'
                                : idea.status === 'completed'
                                  ? 'outline'
                                  : 'secondary'
                          }
                          className="text-xs"
                        >
                          {idea.status.replace('_', ' ')}
                        </Badge>
                        <Badge
                          variant={
                            idea.priority === 'high' ? 'destructive' : 
                            idea.priority === 'medium' ? 'default' : 'outline'
                          }
                          className="text-xs"
                        >
                          {idea.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground" suppressHydrationWarning>
                        {new Date(idea.created_at).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">You don't have recent ideas</p>
                  <p className="text-xs">Create your first idea!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Suggestions
            </CardTitle>
            <CardDescription>
              Personalized recommendations for you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900">
                  💡 Combine similar ideas
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  You have {totalIdeas} ideas about mobile apps that could be merged
                </p>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-900">
                  🚀 Prioritize by impact
                </p>
                <p className="text-xs text-green-700 mt-1">
                  Your high priority ideas need attention
                </p>
              </div>
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm font-medium text-purple-900">
                  📅 Review old ideas
                </p>
                <p className="text-xs text-purple-700 mt-1">
                  Some ideas haven't been updated in a while
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}