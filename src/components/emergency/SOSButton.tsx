
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Phone, MapPin, Clock } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const SOSButton = () => {
  const [isActivated, setIsActivated] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  };

  const sendSOSAlert = async () => {
    try {
      console.log('=== SOS ALERT PROCESS STARTED ===');
      console.log('User Profile:', userProfile);
      console.log('Auth UID:', userProfile?.uid);
      console.log('User Email:', userProfile?.email);
      console.log('Display Name:', userProfile?.displayName);
      
      // Check if user is authenticated
      if (!userProfile?.uid) {
        console.error('ERROR: User not authenticated');
        throw new Error('Please login to send SOS alert');
      }
      
      console.log('✓ User authentication verified');
      setIsActivated(true);
      
      console.log('Getting current location...');
      // Get current location
      const currentLocation = await getCurrentLocation();
      console.log('✓ Location obtained:', currentLocation);
      setLocation(currentLocation);

      const alertData = {
        userId: userProfile.uid,
        userName: userProfile.displayName || userProfile.email || 'Unknown User',
        userPhone: userProfile.phoneNumber || 'Not provided',
        location: currentLocation,
        locationString: `${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}`,
        timestamp: serverTimestamp(),
        status: 'active',
        type: 'emergency',
        priority: 'critical'
      };

      console.log('✓ Alert data prepared:', alertData);
      console.log('Attempting to send to Firebase...');

      // Send SOS to Firebase
      const docRef = await addDoc(collection(db, 'sos_alerts'), alertData);

      console.log('✓ SOS Alert sent successfully with ID:', docRef.id);
      console.log('=== SOS ALERT PROCESS COMPLETED ===');

      // Auto-call emergency services (simulated)
      setTimeout(() => {
        console.log('Opening emergency call...');
        window.open('tel:+911234567890', '_self');
      }, 2000);

      toast({
        title: "SOS Alert Sent Successfully!",
        description: `Emergency alert sent! Location: ${alertData.locationString}. Help is on the way.`,
        variant: "destructive"
      });

    } catch (error) {
      console.error('=== SOS ERROR DETAILS ===');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      console.error('Full error:', error);
      console.error('=== END SOS ERROR ===');
      
      setIsActivated(false); // Reset state on error
      
      let errorMessage = "Could not send alert. Try calling emergency services directly.";
      
      if (error.message.includes('auth')) {
        errorMessage = "Please login first to send SOS alert.";
      } else if (error.message.includes('permission')) {
        errorMessage = "Location permission denied. Enable location and try again.";
      } else if (error.message.includes('network') || error.code === 'unavailable') {
        errorMessage = "Network error. Check connection and try again.";
      } else if (error.code === 'permission-denied') {
        errorMessage = "Permission denied. Please login and try again.";
      }
      
      toast({
        title: "SOS Failed",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const cancelSOS = async () => {
    setIsActivated(false);
    setLocation(null);
    toast({
      title: "SOS Cancelled",
      description: "Emergency alert has been cancelled.",
    });
  };

  if (isActivated) {
    return (
      <div className="space-y-4">
        <Alert className="border-destructive bg-destructive/10">
          <Phone className="h-4 w-4" />
          <AlertDescription className="text-destructive">
            <div className="font-semibold">SOS ACTIVATED</div>
            <div className="text-sm mt-2">
              Emergency services notified. Help is on the way.
            </div>
            {location && (
              <div className="flex items-center mt-2 text-xs">
                <MapPin className="h-3 w-3 mr-1" />
                Location: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </div>
            )}
          </AlertDescription>
        </Alert>
        
        <div className="flex space-x-2">
          <Button 
            onClick={cancelSOS}
            variant="outline" 
            className="flex-1"
          >
            Cancel SOS
          </Button>
          <Button 
            onClick={() => window.open('tel:+911234567890', '_self')}
            className="flex-1 bg-destructive hover:bg-destructive/90"
          >
            <Phone className="h-4 w-4 mr-2" />
            Call Now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button
      onClick={sendSOSAlert}
      className="w-full h-20 bg-destructive hover:bg-destructive/90 text-destructive-foreground text-lg font-bold"
    >
      <div className="text-center">
        <Phone className="h-8 w-8 mx-auto mb-2" />
        <div>SOS EMERGENCY</div>
        <div className="text-sm font-normal">Tap to send alert + location</div>
      </div>
    </Button>
  );
};

export default SOSButton;
