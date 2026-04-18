import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import WebLayout from "../layout/WebLayout";
import { GET_TOURS, UPLOADS_HOST } from "../resources/server-API";
import axios from "axios";
import { useNavigate } from "react-router";

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};

const getStatusVariant = (status) => {
  switch (status) {
    case "upcoming":
      return "default";
    case "recent":
      return "outline";
    default:
      return "secondary";
  }
};

// Reusable Tour Card Component
const TourCard = ({ tour, onBookTour }) => (
  <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-800 rounded-3xl">
    <div className="relative">
      <AspectRatio ratio={16 / 9}>
        <img
          src={getTourImageUrl(tour.image)}
          alt={tour.title}
          className="object-cover w-full h-full transition duration-500 hover:scale-105"
          onError={(e) => {
            e.target.src = "/placeholder-tour.jpg";
          }}
        />
      </AspectRatio>

      <div className="absolute inset-x-0 top-4 px-4 flex flex-wrap items-center gap-3">
        <Badge variant={getStatusVariant(tour.status)}>
          {tour.status ? tour.status : "available"}
        </Badge>
        {(tour.startDate || tour.endDate) && (
          <span className="rounded-full bg-black/60 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white">
            {tour.startDate && tour.endDate
              ? `${formatDate(tour.startDate)} • ${formatDate(tour.endDate)}`
              : "Flexible dates"}
          </span>
        )}
      </div>
    </div>

    <CardHeader className="space-y-3 px-6 pt-6 pb-0">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <CardTitle className="text-2xl leading-tight">{tour.title}</CardTitle>
          <CardDescription className="line-clamp-3 text-sm text-slate-600 dark:text-slate-300">
            {tour.description}
          </CardDescription>
        </div>
        <StarRating rating={4} />
      </div>
    </CardHeader>

    <CardContent className="space-y-5 px-6 pb-6 pt-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Starting from</p>
          <p className="text-2xl font-semibold text-emerald-600">PKR {tour.price}</p>
        </div>
        <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-600">
          Per person
        </div>
      </div>

      <Button
        onClick={() => onBookTour(tour)}
        className="w-full bg-green-600 text-white hover:bg-green-700"
      >
        Book Now
      </Button>
    </CardContent>
  </Card>
);

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
    <div className="max-w-7xl mx-auto space-y-12 pt-16 pb-16 mt-10">

      {/* ---------- UPCOMING TOURS ---------- */}
      <section>
        <h2 className="text-4xl font-bold mb-4 text-center">Upcoming Tours</h2>
        <p className="text-center text-gray-600 mb-10">
          Discover amazing destinations and book your next adventure with us.
        </p>

        {tours.filter(tour => tour.status === 'upcoming' || tour.status === 'available').length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.filter(tour => tour.status === 'upcoming' || tour.status === 'available').map(tour => (
              <TourCard key={tour._id} tour={tour} onBookTour={handleBookTour} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No upcoming tours available at the moment.</p>
            <p className="text-gray-400 mt-2">Please check back later for exciting new destinations.</p>
          </div>
        )}
      </section>

      {/* ---------- RECENT TOURS ---------- */}
      <section>
        <h2 className="text-4xl font-bold mb-4 text-center">Recent Tours</h2>
        <p className="text-center text-gray-600 mb-10">
          Explore our recently completed adventures and plan your next trip.
        </p>

        {tours.filter(tour => tour.status === 'recent').length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.filter(tour => tour.status === 'recent').map(tour => (
              <TourCard key={tour._id} tour={tour} onBookTour={handleBookTour} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No recent tours available at the moment.</p>
            <p className="text-gray-400 mt-2">Check out our upcoming tours instead.</p>
          </div>
        )}
      </section>

    </div>
    </WebLayout>
    </>
  );
};

export default Tour;
