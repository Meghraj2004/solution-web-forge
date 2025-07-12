
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, AlertTriangle, Camera, MapPin, Phone, Activity, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: AlertTriangle,
      title: "Disaster & Emergency Preparedness",
      description: "Real-time disaster simulation, fire escape routes, and emergency response systems",
      badge: "Critical"
    },
    {
      icon: Camera,
      title: "AI-Based Surveillance & Crowd Control",
      description: "Intelligent traffic monitoring, facial recognition, and predictive crowd flow algorithms",
      badge: "AI Powered"
    },
    {
      icon: Users,
      title: "Crowd & Barricade Management",
      description: "Dynamic crowd control protocols and real-time barricading systems",
      badge: "Live"
    },
    {
      icon: Phone,
      title: "Mobile Medical Units",
      description: "Primary health centres linked to emergency health response systems",
      badge: "24/7"
    }
  ];

  const stats = [
    { label: "Active Pilgrims", value: "1,245", icon: Users },
    { label: "Emergency Alerts", value: "3", icon: AlertTriangle },
    { label: "Surveillance Cameras", value: "156", icon: Camera },
    { label: "Response Time", value: "2.3 min", icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Pilgrim Safety & Surveillance System</h1>
            </div>
            <div className="flex space-x-4">
              <Link to="/admin">
                <Button variant="outline">Admin Dashboard</Button>
              </Link>
              <Link to="/user">
                <Button>User Dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ensuring Pilgrim Safety Through Advanced Surveillance
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Real-time monitoring, emergency preparedness, and AI-powered crowd control systems 
            designed to protect pilgrims during their sacred journey.
          </p>
          
          {/* Live Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur">
                <CardContent className="p-6 text-center">
                  <stat.icon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center space-x-4">
            <Link to="/admin">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Shield className="mr-2 h-5 w-5" />
                Admin Control Center
              </Button>
            </Link>
            <Link to="/user">
              <Button size="lg" variant="outline">
                <Users className="mr-2 h-5 w-5" />
                Pilgrim Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Comprehensive Safety Solutions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <feature.icon className="h-10 w-10 text-blue-600" />
                    <Badge variant={feature.badge === "Critical" ? "destructive" : "default"}>
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-12 bg-red-50 border-t-4 border-red-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Phone className="h-8 w-8 text-red-600 mr-3" />
            <h3 className="text-2xl font-bold text-red-800">Emergency Hotline</h3>
          </div>
          <p className="text-xl font-bold text-red-700 mb-2">24/7 Emergency Response: 1-800-PILGRIM</p>
          <p className="text-red-600">Available in multiple languages for immediate assistance</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 mr-2" />
            <span className="font-semibold">Pilgrim Safety & Surveillance System</span>
          </div>
          <p className="text-gray-400">Protecting pilgrims through technology and vigilance</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
