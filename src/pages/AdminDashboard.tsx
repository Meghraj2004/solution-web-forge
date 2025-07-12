import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Shield, Users, Camera, AlertTriangle, MapPin, Activity, 
  Phone, Clock, ChevronLeft, Settings, Bell, Eye,
  TrendingUp, TrendingDown, Zap, Heart, LogOut
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { collection, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const AdminDashboard = () => {
  const { userProfile, logout } = useAuth();
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);
  const [realTimeData, setRealTimeData] = useState({
    totalUsers: 0,
    activeCameras: 152,
    totalCameras: 156,
    emergencyUnits: 12,
    responseTime: 2.3
  });

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

  useEffect(() => {
    // Real-time alerts listener
    const unsubscribeAlerts = onSnapshot(collection(db, 'alerts'), (snapshot) => {
      const alerts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setActiveAlerts(alerts);
    });

    // Real-time users count
    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setRealTimeData(prev => ({
        ...prev,
        totalUsers: snapshot.size
      }));
    });

    return () => {
      unsubscribeAlerts();
      unsubscribeUsers();
    };
  }, []);

  const createTestAlert = async () => {
    try {
      await addDoc(collection(db, 'alerts'), {
        type: "High Crowd Density",
        location: "Main Gate",
        severity: "High",
        timestamp: serverTimestamp(),
        resolved: false
      });
    } catch (error) {
      console.error("Error creating alert:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Header */}
      <header className="bg-card/60 backdrop-blur-lg shadow-xl border-b border-border/50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/">
                <Button variant="ghost" size="sm" className="mr-4 hover:bg-primary/10">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              </Link>
              <Shield className="h-6 w-6 text-primary mr-3" />
              <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                Admin Control Center
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Welcome, {userProfile?.displayName}
              </span>
              <Button variant="outline" size="sm" className="border-primary/20">
                <Bell className="h-4 w-4 mr-2" />
                Alerts ({activeAlerts.length})
              </Button>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Test Button for Demo */}
        <div className="mb-4">
          <Button onClick={createTestAlert} className="bg-primary hover:bg-primary/90">
            Create Test Alert
          </Button>
        </div>

        {/* Emergency Alerts */}
        {activeAlerts.length > 0 && (
          <div className="mb-6 space-y-3">
            {activeAlerts.map((alert) => (
              <Alert key={alert.id} className={`border-l-4 ${
                alert.severity === 'Critical' ? 'border-destructive bg-destructive/10' :
                alert.severity === 'High' ? 'border-orange-500 bg-orange-500/10' :
                'border-yellow-500 bg-yellow-500/10'
              } backdrop-blur-sm`}>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="flex items-center justify-between">
                  <span>{alert.type} at {alert.location}</span>
                  <Badge variant={alert.severity === 'Critical' ? 'destructive' : 'default'}>
                    {alert.severity}
                  </Badge>
                </AlertTitle>
                <AlertDescription>
                  Real-time Firebase alert • Response team dispatched
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Main Dashboard */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-card/60 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="surveillance">Surveillance</TabsTrigger>
            <TabsTrigger value="emergency">Emergency</TabsTrigger>
            <TabsTrigger value="crowd">Crowd Control</TabsTrigger>
            <TabsTrigger value="health">Health Units</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-card/60 backdrop-blur-sm border-border/50 hover:border-primary/20 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{realTimeData.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingUp className="inline h-3 w-3 mr-1 text-green-400" />
                    Real-time count
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/60 backdrop-blur-sm border-border/50 hover:border-primary/20 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Surveillance Status</CardTitle>
                  <Camera className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{realTimeData.activeCameras}/{realTimeData.totalCameras}</div>
                  <p className="text-xs text-muted-foreground">
                    97% operational
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/60 backdrop-blur-sm border-border/50 hover:border-primary/20 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{realTimeData.responseTime} min</div>
                  <p className="text-xs text-muted-foreground">
                    <TrendingDown className="inline h-3 w-3 mr-1 text-green-400" />
                    Improved by 15%
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/60 backdrop-blur-sm border-border/50 hover:border-primary/20 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Emergency Units</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{realTimeData.emergencyUnits}</div>
                  <p className="text-xs text-muted-foreground">
                    All units active
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Location Status */}
            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-foreground">Location Status & Crowd Density</CardTitle>
                <CardDescription>Real-time monitoring of pilgrim distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pilgrimStats.map((location, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-border/50 rounded-lg bg-card/30 backdrop-blur-sm">
                      <div className="flex items-center space-x-4">
                        <MapPin className="h-5 w-5 text-primary" />
                        <div>
                          <div className="font-medium text-foreground">{location.location}</div>
                          <div className="text-sm text-muted-foreground">{location.count}/{location.capacity} capacity</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-32">
                          <Progress value={(location.count / location.capacity) * 100} className="bg-muted/30" />
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
              <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">
                    <Camera className="h-5 w-5 mr-2" />
                    AI Surveillance Network
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-foreground">Facial Recognition System</span>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-foreground">Crowd Flow Algorithm</span>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Processing</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-foreground">Lost & Found System</span>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Monitoring</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-foreground">Traffic Monitoring</span>
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Alert</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/60 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">
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
                            ? 'bg-green-500/20 border-green-500/30 text-green-400'
                            : 'bg-red-500/20 border-red-500/30 text-red-400'
                        }`}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
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
