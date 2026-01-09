import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { MapPin, Train, Car, Plane, Building2, Wifi, Coffee, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const amenities = [
  { icon: Wifi, label: "High-Speed WiFi" },
  { icon: Coffee, label: "Catering Services" },
  { icon: Users, label: "Meeting Rooms" },
  { icon: Building2, label: "Exhibition Hall" },
];

const transportation = [
  { icon: Train, label: "MRT", description: "5 min walk from Innovation Hub Station" },
  { icon: Car, label: "Parking", description: "500+ parking spaces available" },
  { icon: Plane, label: "Airport", description: "30 min from Changi Airport" },
];

export default function Venue() {
  return (
    <Layout>
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
              Event <span className="gradient-text">Venue</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Join us at Innovation Hub, Singapore's premier technology and innovation center
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Map / Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h3 className="font-display text-2xl font-bold">Innovation Hub</h3>
                    <p className="text-muted-foreground">Singapore</p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-display text-xl font-semibold mb-2">Innovation Hub Singapore</h3>
                  <p className="text-muted-foreground mb-4">
                    123 Innovation Drive, One-North<br />
                    Singapore 138456
                  </p>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Open in Google Maps →
                  </a>
                </CardContent>
              </Card>
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-8"
            >
              {/* Amenities */}
              <div>
                <h3 className="font-display text-xl font-semibold mb-4">Venue Amenities</h3>
                <div className="grid grid-cols-2 gap-4">
                  {amenities.map((amenity) => (
                    <Card key={amenity.label} className="bg-card/50">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                          <amenity.icon className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="font-medium">{amenity.label}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Transportation */}
              <div>
                <h3 className="font-display text-xl font-semibold mb-4">Getting There</h3>
                <div className="space-y-3">
                  {transportation.map((item) => (
                    <Card key={item.label} className="bg-card/50">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                          <item.icon className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                          <h4 className="font-medium">{item.label}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Nearby Hotels */}
              <div>
                <h3 className="font-display text-xl font-semibold mb-4">Nearby Hotels</h3>
                <Card className="bg-card/50">
                  <CardContent className="p-4">
                    <p className="text-muted-foreground mb-3">
                      We've partnered with several hotels near the venue offering special rates for attendees.
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li>• Park Royal Collection Marina Bay (10 min)</li>
                      <li>• Crowne Plaza Singapore (15 min)</li>
                      <li>• Holiday Inn Express (5 min)</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
