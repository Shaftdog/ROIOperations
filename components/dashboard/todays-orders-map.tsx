"use client";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useMemo } from "react";
import type { Order } from "@/types/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TodaysOrdersMapProps {
  orders: Order[];
}

const containerStyle = {
  width: "100%",
  height: "320px",
};

export function TodaysOrdersMap({ orders }: TodaysOrdersMapProps) {
  const { isLoaded } = useJsApiLoader({ id: "google-map-script", googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "" });

  const center = useMemo(() => {
    if (orders.length === 0) {
      return { lat: 39.8283, lng: -98.5795 };
    }
    const latitudes = orders.map((order) => Number(order.metadata?.lat ?? 39.8283));
    const longitudes = orders.map((order) => Number(order.metadata?.lng ?? -98.5795));
    return { lat: latitudes.reduce((a, b) => a + b, 0) / latitudes.length, lng: longitudes.reduce((a, b) => a + b, 0) / longitudes.length };
  }, [orders]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Today&apos;s orders map</CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        {!isLoaded ? (
          <div className="flex h-[320px] items-center justify-center rounded-lg border border-dashed border-slate-200 text-sm text-slate-500">
            Provide a Google Maps API key to view the live map.
          </div>
        ) : (
          <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={orders.length ? 10 : 4} options={{ disableDefaultUI: true }}>
            {orders.map((order) => (
              <Marker
                key={order.id}
                position={{
                  lat: Number(order.metadata?.lat ?? center.lat),
                  lng: Number(order.metadata?.lng ?? center.lng),
                }}
                title={`${order.property_address}, ${order.property_city}`}
              />
            ))}
          </GoogleMap>
        )}
      </CardContent>
    </Card>
  );
}
