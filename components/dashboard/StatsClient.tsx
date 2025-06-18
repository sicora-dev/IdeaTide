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
import { Brain, TrendingUp, TrendingDown, Zap, Lightbulb, PlayCircle, CheckCircle, House, ArrowRight, Sparkles } from 'lucide-react';
import { SelectIdea } from '@/lib/db/schema';
import { useRouter } from 'next/navigation';
import {  useEffect, useMemo, useState } from 'react';
import { findSimilarIdeas } from '@/lib/db/queries';
import { StatsCardSkeleton } from '../skeletons/StastCardSkeleton';

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
            label: "Ideas Created",
            color: "hsl(var(--primary))"
          },
        },
        showChart: true,
        gradient: "from-blue-50 to-blue-100/50",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600"
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
            label: "In Progress",
            color: "hsl(var(--chart-2))"
          },
        },
        showChart: true,
        gradient: "from-orange-50 to-orange-100/50",
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600"
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
            label: "Completed",
            color: "hsl(var(--chart-3))"
          },
        },
        showChart: true,
        gradient: "from-green-50 to-green-100/50",
        iconBg: "bg-green-100",
        iconColor: "text-green-600"
      }
    ];
  }, [totalIdeas, inProgress, completed, monthlyCharts]);

  const gotoIdea = (id: number) => () => {
    router.push(`/dashboard/ideas/${id}`);
  }

  const handleCombineIdea = async () => {
    const result = await findSimilarIdeas("16")
    console.log('Similar ideas found:', result);
    console.log('Combining similar ideas...');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'new': 'bg-blue-100 text-blue-800 border-blue-200',
      'in_progress': 'bg-orange-100 text-orange-800 border-orange-200',
      'under_review': 'bg-purple-100 text-purple-800 border-purple-200',
      'completed': 'bg-green-100 text-green-800 border-green-200'
    } as const;

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant="outline" className={`text-xs font-medium ${config || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      'high': 'bg-red-100 text-red-800 border-red-200',
      'medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'low': 'bg-green-100 text-green-800 border-green-200'
    } as const;

    const config = priorityConfig[priority as keyof typeof priorityConfig];
    return (
      <Badge variant="outline" className={`text-xs font-medium ${config || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {priority}
      </Badge>
    );
  };

  useEffect(() => {
    console.log('StatsClient client-side effect:', {
      dashboardData,
      timestamp: new Date().toISOString()
    });
  }, []);

  if (!isClient) {
    return (
      <div className="h-full space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                <House className="h-6 w-6" />
              </div>
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome to your idea control center
            </p>
          </div>
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <StatsCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
              <House className="h-6 w-6" />
            </div>
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome to your idea control center
          </p>
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
                  <div className={`p-2 rounded-lg ${stat.iconBg} group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className={`h-4 w-4 ${stat.iconColor}`} />
                  </div>
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
                  <div className={`p-2 rounded-lg ${stat.iconBg} group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className={`h-4 w-4 ${stat.iconColor}`} />
                  </div>
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
              <Card key={index} className={`relative overflow-hidden h-60 border-2 hover:border-primary/20 transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-card to-card/50 group`}>
                <CardHeader className={`flex flex-row items-center justify-between space-y-0 ${stat.showChart ? 'pb-2' : 'pb-0 flex-shrink-0'}`}>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.iconBg} group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className={`h-4 w-4 ${stat.iconColor}`} />
                  </div>
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
                      <ChartContainer className='h-28 w-full' config={stat.chartConfig}>
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
        <Card className="border-2 hover:border-primary/20 transition-all duration-300 bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Zap className="h-5 w-5 text-purple-600" />
              </div>
              Recent Ideas
            </CardTitle>
            <CardDescription>Your last 3 created ideas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentIdeas.length > 0 ? (
                recentIdeas.map((idea) => (
                  <div
                    onClick={gotoIdea(idea.id)}
                    key={idea.id}
                    className="group flex items-center justify-between p-4 border-2 border-transparent rounded-xl hover:bg-accent/50 hover:border-accent/30 transition-all duration-200 cursor-pointer hover:shadow-md max-h-24"
                  >
                    <div className="space-y-2 flex-1">
                      <p className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                        {idea.title}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
                          {idea.category}
                        </Badge>
                        {getStatusBadge(idea.status)}
                        {getPriorityBadge(idea.priority)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                        <span suppressHydrationWarning>
                          {new Date(idea.created_at).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                    <Lightbulb className="h-8 w-8 opacity-50" />
                  </div>
                  <p className="text-sm font-medium mb-1">No recent ideas</p>
                  <p className="text-xs">Create your first idea to get started!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100">
                <Sparkles className="h-5 w-5 bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text" />
              </div>
              AI Suggestions
            </CardTitle>
            <CardDescription>
              Personalized recommendations for you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                onClick={handleCombineIdea} 
                variant="ghost" 
                className="group flex flex-col w-full p-4 gap-2 items-start h-auto bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200/50 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-2 w-full">
                  <div className="p-1 rounded bg-blue-100">
                    <Sparkles className="h-3 w-3 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium text-blue-900">
                    Combine similar ideas
                  </p>
                  <ArrowRight className="h-3 w-3 text-blue-600 ml-auto group-hover:translate-x-1 transition-transform duration-200" />
                </div>
                <p className="text-xs text-blue-700 text-left">
                  You have {totalIdeas} ideas about mobile apps that could be merged
                </p>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}