import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import WebLayout from "../layout/WebLayout";
import { GET_TOURS, UPLOADS_HOST } from "../resources/server-API";
import axios from "axios";
import { useNavigate } from "react-router";

// ------------------ COMPONENT ------------------

const Tour = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get(GET_TOURS);
        if (response.data.status) {
          setTours(response.data.tours || []);
        }
      } catch (error) {
        console.error("Error fetching tours:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  const handleBookTour = (tour) => {
    navigate("/booktour", {
      state: {
        id: tour._id,
        title: tour.title,
        price: tour.price
      }
    });
  };

  // Star Rating Component
  const StarRating = ({ rating }) => (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={18}
          className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
        />
      ))}
    </div>
  );

  const getTourImageUrl = (image) => {
    if (!image) return "/placeholder-tour.jpg";
    if (/^https?:\/\//.test(image)) return image;
    if (image.startsWith("/uploads/")) return `http://localhost:5000${image}`;
    if (image.startsWith("uploads/")) return `http://localhost:5000/${image}`;
    if (image.startsWith("/")) return `http://localhost:5000${image}`;
    return `${UPLOADS_HOST}/${image.replace(/^\/+/, "")}`;
  };

  if (loading) {
    return (
      <WebLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-lg text-muted-foreground">Loading tours...</div>
        </div>
      </WebLayout>
    );
  }

  return (
    <>
    <WebLayout>
    <div className="max-w-7xl mx-auto space-y-6 pt-16 pb-16 mt-10">

      {/* ---------- AVAILABLE TOURS ---------- */}
      <section>
        <h2 className="text-4xl font-bold mb-4 text-center">Available Tours</h2>
        <p className="text-center text-gray-600 mb-10">
          Discover amazing destinations and book your next adventure with us.
        </p>

        {tours.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map(tour => (
              <Card
                key={tour._id}
                className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border rounded-xl p-0 m-0">
                <AspectRatio ratio={16 / 9}>
                  <img
                      src={getTourImageUrl(tour.image)}
                    onError={(e) => {
                      e.target.src = "/placeholder-tour.jpg"; // fallback image
                    }}
                  />
                </AspectRatio>

                <CardHeader>
                  <CardTitle className="text-xl">{tour.title}</CardTitle>
                  <CardDescription className="line-clamp-3">{tour.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-green-600">
                      PKR {tour.price}
                    </div>
                    <div className="text-sm text-gray-500">
                      per person
                    </div>
                  </div>

                  <Button
                    onClick={() => handleBookTour(tour)}
                    className="w-full bg-green-600 text-white hover:bg-green-700"
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No tours available at the moment.</p>
            <p className="text-gray-400 mt-2">Please check back later for exciting new destinations.</p>
          </div>
        )}
      </section>

    </div>
    </WebLayout>
    </>
  );
};

export default Tour;
