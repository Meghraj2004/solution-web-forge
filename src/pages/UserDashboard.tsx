
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Users, MapPin, Phone, Heart, Shield, Navigation,
  Clock, AlertTriangle, ChevronLeft, Bell, Info,
  Camera, Wifi, Battery, Signal
} from "lucide-react";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const [emergencyContacts] = useState([
    { name: "Emergency Hotline", number: "1-800-PILGRIM", type: "Emergency" },
    { name: "Medical Assistance", number: "1-800-MEDICAL", type: "Health" },
    { name: "Lost & Found", number: "1-800-LOST", type: "Support" },
    { name: "Travel Assistance", number: "1-800-TRAVEL", type: "Travel" }
  ]);

  const [safetyAlerts] = useState([
    { type: "Weather Alert", message: "Light rain expected in 2 hours", severity: "Medium" },
    { type: "Crowd Notice", message: "High density at Temple Complex - alternative routes available", severity: "Low" }
  ]);

  const [userLocation] = useState({
    current: "Main Entrance Plaza",
    zone: "Zone A",
    coordinates: "25.3176° N, 82.9739° E"
  });

  const [nearbyServices] = useState([
    { name: "Medical Unit 3", distance: "50m", type: "Health", status: "Available" },
    { name: "Rest Area B", distance: "120m", type: "Rest", status: "Open" },
    { name: "Information Kiosk", distance: "200m", type: "Info", status: "Staffed" },
    { name: "Emergency Assembly Point", distance: "300m", type: "Safety", status: "Active" }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              </Link>
              <Shield className="h-6 w-6 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Pilgrim Safety Portal</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-800">
                <Wifi className="h-3 w-3 mr-1" />
                Connected
              </Badge>
              <Badge className="bg-blue-100 text-blue-800">
                <Signal className="h-3 w-3 mr-1" />
                Strong
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Emergency Quick Actions */}
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center text-red-800">
              <Phone className="h-5 w-5 mr-2" />
              Emergency Services
            </CardTitle>
            <CardDescription className="text-red-600">
              Tap for immediate assistance - Available 24/7
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button className="bg-red-600 hover:bg-red-700 text-white h-16">
                <div className="text-center">
                  <Phone className="h-6 w-6 mx-auto mb-1" />
                  <div className="text-sm">Emergency Call</div>
                </div>
              </Button>
              <Button variant="outline" className="border-red-300 text-red-700 h-16">
                <div className="text-center">
                  <Heart className="h-6 w-6 mx-auto mb-1" />
                  <div className="text-sm">Medical Help</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Safety Alerts */}
        {safetyAlerts.length > 0 && (
          <div className="space-y-3">
            {safetyAlerts.map((alert, index) => (
              <Alert key={index} className={`${
                alert.severity === 'High' ? 'border-red-300 bg-red-50' :
                alert.severity === 'Medium' ? 'border-orange-300 bg-orange-50' :
                'border-blue-300 bg-blue-50'
              }`}>
                <Bell className="h-4 w-4" />
                <AlertTitle>{alert.type}</AlertTitle>
                <AlertDescription>{alert.message}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Current Location & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Your Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-lg font-semibold text-blue-700">{userLocation.current}</div>
              <div className="text-sm text-gray-600">
                <div>Zone: {userLocation.zone}</div>
                <div>Coordinates: {userLocation.coordinates}</div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <Navigation className="h-4 w-4 mr-2" />
                Get Directions
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Area Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Crowd Density</span>
                <Badge variant="outline">Moderate</Badge>
              </div>
              <Progress value={65} className="w-full" />
              <div className="text-sm text-gray-600">
                Current: 342 people • Capacity: 500
              </div>
              <div className="text-xs text-green-600">
                ✓ Safe to proceed • Alternative routes available
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Nearby Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Nearby Services
            </CardTitle>
            <CardDescription>Essential services within walking distance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {nearbyServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      service.type === 'Health' ? 'bg-red-500' :
                      service.type === 'Safety' ? 'bg-orange-500' :
                      service.type === 'Rest' ? 'bg-green-500' :
                      'bg-blue-500'
                    }`} />
                    <div>
                      <div className="font-medium">{service.name}</div>
                      <div className="text-sm text-gray-500">{service.distance} • {service.type}</div>
                    </div>
                  </div>
                  <Badge variant={service.status === 'Available' ? 'default' : 'secondary'}>
                    {service.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              Emergency Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {emergencyContacts.map((contact, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-16 justify-start"
                  onClick={() => window.open(`tel:${contact.number}`, '_self')}
                >
                  <div className="text-left">
                    <div className="font-medium">{contact.name}</div>
                    <div className="text-sm text-gray-500">{contact.number}</div>
                    <div className="text-xs text-blue-600">{contact.type}</div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Safety Tips */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-800">
              <Info className="h-5 w-5 mr-2" />
              Safety Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-blue-700">
              <div>• Stay within designated areas and follow crowd control barriers</div>
              <div>• Keep emergency contacts easily accessible</div>
              <div>• Report any suspicious activity to security personnel</div>
              <div>• Follow evacuation routes in case of emergency</div>
              <div>• Stay hydrated and take regular breaks</div>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Safety System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 border rounded-lg bg-green-50">
                <Camera className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className="text-sm font-medium">Surveillance</div>
                <div className="text-xs text-green-600">Active</div>
              </div>
              <div className="text-center p-3 border rounded-lg bg-green-50">
                <Heart className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className="text-sm font-medium">Medical</div>
                <div className="text-xs text-green-600">Ready</div>
              </div>
              <div className="text-center p-3 border rounded-lg bg-green-50">
                <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className="text-sm font-medium">Emergency</div>
                <div className="text-xs text-green-600">Standby</div>
              </div>
              <div className="text-center p-3 border rounded-lg bg-green-50">
                <Wifi className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <div className="text-sm font-medium">Network</div>
                <div className="text-xs text-green-600">Strong</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
