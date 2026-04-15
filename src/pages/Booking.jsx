import React, { useState, useEffect } from "react";
import axios from "axios";
import { UPLOADS_HOST, GET_TOURS } from "@/resources/server-API";
import WebLayout from "../layout/WebLayout";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TravelDeals from "../components/TravelDeals";
import { useNavigate } from "react-router";

const Booking = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getTourImageUrl = (image) => {
    if (!image) return "https://placehold.co/600x400";
    if (/^https?:\/\//.test(image)) return image;
    if (image.startsWith("/uploads/")) return `http://localhost:5000${image}`;
    if (image.startsWith("uploads/")) return `http://localhost:5000/${image}`;
    return `${UPLOADS_HOST}/${image.replace(/^\/+/, "")}`;
  };

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(GET_TOURS, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.data.status) {
          setTours(res.data.tours);
        } else {
          setError(res.data.message || "Unable to load tours at the moment.");
        }
      } catch (error) {
        console.error("Failed to fetch tours:", error);
        setError("Unable to load tours. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  const navigate = useNavigate();

  return (
    <WebLayout>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.12),transparent_40%),radial-gradient(circle_at_bottom,_rgba(14,165,233,0.08),transparent_38%)] text-foreground pb-20 px-4">

        <section className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-emerald-600 via-cyan-600 to-sky-500 px-8 py-16 text-white shadow-2xl">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-200 font-semibold mb-4">Your next adventure starts here</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Book the perfect tour across Pakistan in minutes</h1>
            <p className="mt-4 text-lg text-emerald-100/90">Compare curated experiences, preview itineraries, and reserve your spot with a secure booking flow.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button onClick={() => navigate("/tours")} className="bg-white text-emerald-700 hover:bg-slate-100 hover:cursor-pointer">Browse all tours</Button>
              <Button variant="success" onClick={() => navigate("/contact")} className="text-white border border-white hover:cursor-pointer">Need help?</Button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl mt-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold text-slate-950">Available tours</h2>
              <p className="mt-2 text-slate-600 max-w-2xl">Reserve your seat on one of our best-reviewed trips. Tap book to continue.</p>
            </div>
            {error && <div className="rounded-full bg-rose-50 px-4 py-2 text-sm text-rose-700">{error}</div>}
          </div>

          {loading ? (
            <div className="py-24 text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-green-500/30 border-t-green-600" />
              <p className="mt-4 text-sm text-slate-600">Loading tours...</p>
            </div>
          ) : !tours.length ? (
            <div className="mt-12 rounded-[2rem] border border-dashed border-slate-300 bg-white/90 px-8 py-16 text-center shadow-lg">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">No tours available</p>
              <h3 className="mt-4 text-2xl font-semibold text-slate-950">We're updating our tour list.</h3>
              <p className="mt-3 text-slate-600">Please check back soon or contact our travel experts for a custom experience.</p>
              <Button onClick={() => navigate("/contact")} className="mt-8 bg-green-600 hover:bg-green-700 text-white">Contact support</Button>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-8">
              {tours.map((tour, index) => (
                <Card key={tour._id || index} className="overflow-hidden rounded-[1.75rem] border border-slate-200 shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
                  <div className="h-56 overflow-hidden">
                    <img
                      src={getTourImageUrl(tour.image)}
                      alt={tour.title}
                      className="w-full h-full object-cover transition duration-700 hover:scale-105"
                    />
                  </div>
                  <CardHeader className="px-6 pt-6 pb-0">
                    <h2 className="text-xl font-semibold text-slate-950">{tour.title}</h2>
                  </CardHeader>
                  <CardContent className="space-y-4 px-6 pb-2 pt-4">
                    <p className="text-slate-600 text-sm line-clamp-3">{tour.description}</p>
                    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-700">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">{tour.duration || "Flexible"}</span>
                      <span className="font-semibold text-emerald-700">{tour.price}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="px-6 pb-6 pt-0">
                    <Button
                      onClick={() => navigate("/booktour", {
                        state: {
                          id: tour._id,
                          title: tour.title,
                          price: tour.price
                        }
                      })}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      Book Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-14">
            <TravelDeals />
          </div>
        </section>
      </div>
    </WebLayout>
  );
};

export default Booking;
