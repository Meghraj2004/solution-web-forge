
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Shield, Users, Camera, AlertTriangle, MapPin, Activity, 
  Phone, Clock, ChevronLeft, Settings, Bell, Eye,
  TrendingUp, TrendingDown, Zap, Heart
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [activeAlerts] = useState([
    { id: 1, type: "High Crowd Density", location: "Main Gate", severity: "High", time: "2 min ago" },
    { id: 2, type: "Medical Emergency", location: "Temple Area A", severity: "Critical", time: "5 min ago" },
    { id: 3, type: "Weather Alert", location: "Outdoor Areas", severity: "Medium", time: "15 min ago" }
  ]);

  const [surveillanceData] = useState({
    totalCameras: 156,
    activeCameras: 152,
    crowdDensity: 78,
    emergencyUnits: 12,
    responseTime: 2.3
  });

  const [pilgrimStats] = useState([
    { location: "Main Entrance", count: 342, capacity: 500, status: "Normal" },
    { location: "Temple Complex", count: 456, capacity: 400, status: "High" },
    { location: "Dining Hall", count: 234, capacity: 600, status: "Low" },
    { location: "Rest Areas", count: 123, capacity: 300, status: "Normal" }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              </Link>
              <Shield className="h-6 w-6 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Admin Control Center</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Alerts ({activeAlerts.length})
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Emergency Alerts */}
        {activeAlerts.length > 0 && (
          <div className="mb-6 space-y-3">
            {activeAlerts.map((alert) => (
              <Alert key={alert.id} className={`border-l-4 ${
                alert.severity === 'Critical' ? 'border-red-500 bg-red-50' :
                alert.severity === 'High' ? 'border-orange-500 bg-orange-50' :
                'border-yellow-500 bg-yellow-50'
              }`}>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="flex items-center justify-between">
                  <span>{alert.type} at {alert.location}</span>
                  <Badge variant={alert.severity === 'Critical' ? 'destructive' : 'default'}>
                    {alert.severity}
                  </Badge>
                </AlertTitle>
                <AlertDescription>
                  Reported {alert.time} • Response team dispatched
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Main Dashboard */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="surveillance">Surveillance</TabsTrigger>
            <TabsTrigger value="emergency">Emergency</TabsTrigger>
            <TabsTrigger value="crowd">Crowd Control</TabsTrigger>
            <TabsTrigger value="health">Health Units</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Pilgrims</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,245</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    +12% from yesterday
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Surveillance Status</CardTitle>
                  <Camera className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{surveillanceData.activeCameras}/{surveillanceData.totalCameras}</div>
                  <p className="text-xs text-muted-foreground">
                    97% operational
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{surveillanceData.responseTime} min</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingDown className="inline h-3 w-3 mr-1 text-green-500" />
                    Improved by 15%
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Emergency Units</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{surveillanceData.emergencyUnits}</div>
                  <p className="text-xs text-muted-foreground">
                    All units active
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Location Status */}
            <Card>
              <CardHeader>
                <CardTitle>Location Status & Crowd Density</CardTitle>
                <CardDescription>Real-time monitoring of pilgrim distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pilgrimStats.map((location, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-medium">{location.location}</div>
                          <div className="text-sm text-gray-500">{location.count}/{location.capacity} capacity</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-32">
                          <Progress value={(location.count / location.capacity) * 100} />
                        </div>
                        <Badge variant={
                          location.status === 'High' ? 'destructive' :
                          location.status === 'Normal' ? 'default' : 'secondary'
                        }>
                          {location.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="surveillance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="h-5 w-5 mr-2" />
                    AI Surveillance Network
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Facial Recognition System</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Crowd Flow Algorithm</span>
                      <Badge className="bg-green-100 text-green-800">Processing</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Lost & Found System</span>
                      <Badge className="bg-green-100 text-green-800">Monitoring</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Traffic Monitoring</span>
                      <Badge className="bg-yellow-100 text-yellow-800">Alert</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="h-5 w-5 mr-2" />
                    Camera Grid Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-2">
                    {Array.from({ length: 16 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-12 h-12 rounded border-2 flex items-center justify-center text-xs font-medium ${
                          Math.random() > 0.1
                            ? 'bg-green-100 border-green-300 text-green-800'
                            : 'bg-red-100 border-red-300 text-red-800'
                        }`}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    Green: Active • Red: Offline • Coverage: 100km range
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="emergency" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Disaster Preparedness
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start" variant="outline">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Initiate Fire Evacuation Protocol
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Activate Crowd Dispersal System
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Phone className="h-4 w-4 mr-2" />
                    Emergency Communication Broadcast
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <MapPin className="h-4 w-4 mr-2" />
                    Deploy Mobile Response Units
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Emergency Response Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                      <span className="font-medium">Fire Safety Systems</span>
                      <Badge className="bg-green-100 text-green-800">Operational</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                      <span className="font-medium">Medical Response Teams</span>
                      <Badge className="bg-green-100 text-green-800">12 Units Ready</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
                      <span className="font-medium">Weather Monitoring</span>
                      <Badge className="bg-yellow-100 text-yellow-800">Storm Warning</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="crowd" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dynamic Crowd Control</CardTitle>
                <CardDescription>Real-time barricade management and flow optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-2">78%</div>
                    <div className="text-sm text-gray-600">Overall Crowd Density</div>
                    <Progress value={78} className="mt-2" />
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-2">24</div>
                    <div className="text-sm text-gray-600">Active Barricades</div>
                    <Badge className="mt-2 bg-green-100 text-green-800">Optimized</Badge>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600 mb-2">3.2 km/h</div>
                    <div className="text-sm text-gray-600">Avg Flow Speed</div>
                    <Badge className="mt-2 bg-orange-100 text-orange-800">Monitored</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Mobile Medical Units
                </CardTitle>
                <CardDescription>Primary health centres and emergency response</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Unit {i + 1}</span>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>Location: Zone {String.fromCharCode(65 + i)}</div>
                        <div>Staff: 4 personnel</div>
                        <div>Last Response: {Math.floor(Math.random() * 60)} min ago</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
